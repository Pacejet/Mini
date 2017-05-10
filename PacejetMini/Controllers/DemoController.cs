using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PacejetMini.Models;

namespace PacejetMini.Controllers
{
    public class DemoController : Controller
    {
        public DemoController()
        {
        }

        public IActionResult Index()
        {
            var model = new DemoModelView();
            return View(model);
        }
    }
}
