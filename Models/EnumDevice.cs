using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat
{
    /// <summary>
    /// 设备
    /// </summary>
    public enum EnumDevice
    {
        /// <summary>
        /// 浏览器
        /// </summary>
        Web = 1,

        /// <summary>
        /// 手机浏览器
        /// </summary>
        Mobile = 2,

        /// <summary>
        /// 小程序
        /// </summary>
        Applet = 3,

        /// <summary>
        /// IOS 应用
        /// </summary>
        IOS = 11,

        /// <summary>
        /// IOS 平板
        /// </summary>
        IOS_Tablet = 12,

        /// <summary>
        /// Android 应用
        /// </summary>
        AN = 21,

        /// <summary>
        /// Android 平板
        /// </summary>
        AN_Tablet = 22,
    }
}
