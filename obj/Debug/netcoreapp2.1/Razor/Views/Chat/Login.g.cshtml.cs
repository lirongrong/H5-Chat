#pragma checksum "C:\Users\RR\source\repos\EWS2\4-App\4.0-Basic\Chat\Views\Chat\Login.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "f1c991a5faab743b5ce57f606399c38947104461"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Chat_Login), @"mvc.1.0.view", @"/Views/Chat/Login.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Chat/Login.cshtml", typeof(AspNetCore.Views_Chat_Login))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\Users\RR\source\repos\EWS2\4-App\4.0-Basic\Chat\Views\_ViewImports.cshtml"
using Chat;

#line default
#line hidden
#line 2 "C:\Users\RR\source\repos\EWS2\4-App\4.0-Basic\Chat\Views\_ViewImports.cshtml"
using Util;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"f1c991a5faab743b5ce57f606399c38947104461", @"/Views/Chat/Login.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"1b57c9055fae5cbbfb1e383d4f11dcb72e338204", @"/Views/_ViewImports.cshtml")]
    public class Views_Chat_Login : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#line 1 "C:\Users\RR\source\repos\EWS2\4-App\4.0-Basic\Chat\Views\Chat\Login.cshtml"
  
    Layout = "~/Views/Shared/_Layout.cshtml";

#line default
#line hidden
            BeginContext(54, 432, true);
            WriteLiteral(@"<div id=""body"" style=""width:500px; margin:150px auto;"">
    <h1 class=""h3 mb-3 font-weight-normal"">登录聊天室</h1>
    <label for=""inputEmail"" class=""sr-only"">用户名</label>
    <input type=""text"" id=""txtUserName"" class=""form-control"" placeholder=""用户名"" required autofocus>
    <br />
    <button id=""btnLogin"" class=""btn btn-lg btn-primary btn-block"">登录</button>
    <p class=""mt-5 mb-3 text-muted"">&copy; ERP 2018-8-31 </p>
</div>
");
            EndContext();
            DefineSection("script", async() => {
                BeginContext(508, 275, true);
                WriteLiteral(@"
    <script type=""text/javascript"">
        $(""#btnLogin"").click(function () {
            var userName = $.trim($(""#txtUserName"").val());
            window.localStorage.setItem(""username"", userName);
            location.href = ""/chat/"";
        });
    </script>
");
                EndContext();
            }
            );
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
