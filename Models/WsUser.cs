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
    /// WebSocket 连接
    /// </summary>
    public class WsUser
    {
        /// <summary>
        /// 设备
        /// </summary>
        public EnumDevice Device { get; set; }

        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// WebSocket
        /// </summary>
        public WebSocket WebSocket { get; set; }

        /// <summary>
        /// WebSocket 用户
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <param name="webSocket">WebSocket连接</param>
        /// <param name="device">设备</param>
        public WsUser(string userName, WebSocket webSocket, EnumDevice device = EnumDevice.Web)
        {
            Device = device;
            UserName = userName;
            WebSocket = webSocket;
        }

        /// <summary>
        /// 接收回应
        /// </summary>
        /// <returns></returns>
        public async Task Echo()
        {
            try
            {
                var buffer = new byte[1024 * 4];
                WebSocketReceiveResult result = await WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                while (!result.CloseStatus.HasValue)
                {
                    var content = Encoding.Default.GetString(buffer).TrimEnd('\0');
                    GlobalData.Logger.Log($"{UserName}:{content}");
                    await Excute(content);
                    buffer = new byte[1024 * 4];
                    result = await WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                }
                GlobalData.Logger.Log($"{UserName}:连接即将关闭：{result.CloseStatus}-{result.CloseStatusDescription}");
                await WebSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
            catch (Exception ex)
            {
                GlobalData.Logger.Log($"Echo异常{ex.Message}。", EnumLogLevel.Error, ex);
            }
        }

        /// <summary>
        /// 处理消息数据
        /// </summary>
        /// <param name="data">消息数据</param>
        /// <returns></returns>
        public async Task Excute(string data)
        {
            GlobalData.Logger.Log($"接收的数据{data}");

            var jobj = new JsonObject(data);
            var toUser = jobj["toUser"].Value;
            var toParty = jobj["toParty"].Value;
            var toTag = jobj["toTag"].Value;
            var msgType = jobj["msgType"].Value;

            var result = new object();
            //解析文本
            if (msgType == "text")
            {
                var content = jobj["text"]["content"].Value;
                result = new { FromUser = UserName, MsgType = "text", Text = new { Content = content } };
            }
            //解析图片
            else if (msgType == "image")
            {
                var url = jobj["image"]["url"].Value;
                result = new { FromUser = UserName, MsgType = "image", Image = new { Url = url } };
            }
            //解析文件
            else if (msgType == "file")
            {
                var url = jobj["file"]["url"].Value;
                result = new { FromUser = UserName, MsgType = "file", File = new { Url = url, Type = "rar" } };
            }
            //解析语音
            else if (msgType == "voice")
            {
                var url = jobj["voice"]["url"].Value;
                result = new { FromUser = UserName, MsgType = "voice", File = new { Url = url } };
            }
            //解析视频
            else if (msgType == "video")
            {
                var url = jobj["video"]["url"].Value;
                result = new { FromUser = UserName, MsgType = "video", File = new { Url = url } };
            }
            await WsServer.Send(result, toUser, toParty, toTag);
        }

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="data">内容</param>
        /// <param name="type">类型</param>
        /// <returns></returns>
        public async Task SendAsync(string data, WebSocketMessageType type = WebSocketMessageType.Text)
        {
            try
            {
                if (!WebSocket.CloseStatus.HasValue)
                {
                    var result = Encoding.Default.GetBytes(data);
                    await WebSocket.SendAsync(new ArraySegment<byte>(result, 0, result.Length), type, true, CancellationToken.None);
                }
            }
            catch (Exception ex)
            {
                await WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, $"连接状态为{WebSocket.State}：{ex.Message}", CancellationToken.None);
            }
        }
    }
}
