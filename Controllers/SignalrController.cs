﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Domain;
using Util;
using Util.Web.Controllers;

namespace Chat.Controllers
{
    public class SignalrController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
