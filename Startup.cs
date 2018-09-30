using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Util;
using Cache;
using Log;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.WebEncoders;
using System.Text.Unicode;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Http;
using System.Threading;

namespace Chat
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            //初始化全局变量
            GlobalData.Configuration = Configuration;
            GlobalData.Init(() =>
            {
                if (GlobalData.CacheConfig.Enabled)
                    GlobalData.Cache = new MemoryCache();

                if (GlobalData.LogConfig.Enabled)
                {
                    GlobalData.Logger = new FileLogger();
                    GlobalData.Logger.LimitLevel = GlobalData.LogConfig.LimitLevel;
                    GlobalData.Logger.Target = GlobalData.LogConfig.Target;
                }
            });
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //页面渲染 ViewBag 编码问题
            services.Configure<WebEncoderOptions>(options =>
            {
                options.TextEncoderSettings = new TextEncoderSettings(UnicodeRanges.All);
            });

            //添加页面压缩，头部增加Content-Encoding:gzip 
            services.AddResponseCompression();

            //添加页面缓存
            services.AddResponseCaching();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
           .AddCookie(options =>
           {
               options.Cookie.Name = GlobalData.CookieConfig.Scheme;
               options.AccessDeniedPath = GlobalData.CookieConfig.LoginPath;
               options.LoginPath = GlobalData.CookieConfig.LoginPath;
           });

            // Adds a default in-memory implementation of IDistributedCache.
            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromMinutes(30);
            });

            services.AddMvc()
                    .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                    .AddJsonOptions(options =>
                    {
                        //设置时间格式
                        options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
                    });

            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

            services.AddSignalR(hubOptions =>
            {
                hubOptions.EnableDetailedErrors = true;
                hubOptions.KeepAliveInterval = TimeSpan.FromMinutes(1);
            });

            //添加跨域
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            //使用页面压缩
            app.UseResponseCompression();

            //使用页面缓存
            app.UseResponseCaching();

            //使用 Cookie 授权
            app.UseAuthentication();

            //使用 Session
            app.UseSession();

            app.UseStaticFiles();

            //设置跨域
            app.UseCors(builder =>
                builder.WithOrigins("*").
                        WithMethods("*").
                        WithHeaders("*").
                        WithExposedHeaders("*"));

            //设置静态目录为本项目文件夹
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(GlobalData.EnvConfig.Path)
            });

            //配置 WebSocket 服务
            app.UseWebSockets(new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 4 * 1024
            });

            //启用 WebSocket 服务
            app.Use(async (context, next) =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var user = await WsServer.CreateAsync(context);
                    await user.Echo();
                }
                else
                {
                    await next();
                }
            });

            //启用 MVC
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            //启用 SignalR 服务
            app.UseSignalR(route =>
            {
                route.MapHub<ChatHub>("/chat");
            });
        }
    }
}
