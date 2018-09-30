using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Util;

namespace Chat
{
    /// <summary>
    /// WebSocket 服务
    /// </summary>
    public static class WsServer
    {
        /// <summary>
        /// 已连接的用户
        /// </summary>
        public static List<WsUser> Users = new List<WsUser>();

        /// <summary>
        /// 创建连接
        /// </summary>
        /// <param name="context">上下文</param>
        /// <returns></returns>
        public static async Task<WsUser> CreateAsync(HttpContext context)
        {
            var device = (EnumDevice)(context.Request.Query["dev"].FirstOrDefault() ?? "1").TryInt(1);
            var userName = context.Request.Query["un"];
            WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var user = new WsUser(userName, webSocket, device);
            Users.Add(user);

            GlobalData.Logger.Log($"创建连接{userName}.");

            return user;
        }

        /// <summary>
        /// 执行命令
        /// </summary>
        /// <param name="data">发送的数据</param>
        /// <returns></returns>
        public static async Task Send(object data, string user, string party, string tag)
        {
            //针对用户发送
            if (!string.IsNullOrEmpty(user))
            {
                var userList = new List<WsUser>();
                if (user == "@all")
                    userList = Users;
                else
                {
                    var userNames = user.Split(new char['|'], StringSplitOptions.RemoveEmptyEntries);
                    userList = Users.Where(x => userNames.Contains(x.UserName)).ToList();
                }
                foreach (var wsUser in userList)
                {
                    await wsUser.SendAsync(data.ToJson());
                }
            }
        }
    }
}
