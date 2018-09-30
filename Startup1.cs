//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Text.Encodings.Web;
//using System.Text.Unicode;
//using System.Threading.Tasks;
//using Cache;
//using Log;
//using Microsoft.AspNetCore.Authentication.Cookies;
//using Microsoft.AspNetCore.Builder;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.FileProviders;
//using Microsoft.Extensions.WebEncoders;
//using Util;

//namespace Chat
//{
//    public class Startup : Util.Web.Startup
//    {
//        public override void OnConfigureServices(IServiceCollection services)
//        {
//            services.AddSignalR(hubOptions =>
//            {
//                hubOptions.EnableDetailedErrors = true;
//                hubOptions.KeepAliveInterval = TimeSpan.FromMinutes(1);
//            });
//            base.OnConfigureServices(services);
//        }

//        public override void OnConfigure(IApplicationBuilder app, IHostingEnvironment env)
//        {
//            app.UseSignalR(route =>
//            {
//                route.MapHub<ChatHub>("/chathub");
//            });

//            base.OnConfigure(app, env);
//        }
//    }
//}
