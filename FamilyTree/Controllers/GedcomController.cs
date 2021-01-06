using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using FamilyTree.Services;
using FamilyTree.Models;
using System.Security.Claims;
using System.IO;

namespace FamilyTree.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class GedcomController : ControllerBase
    {
        private IGedcomService gedcomService;
        public GedcomController(IGedcomService gedcomService)
        {
            this.gedcomService = gedcomService;
        }
        [Route("{treeid:int}")]
        [HttpGet]
        public async Task<ActionResult> GetMessagesList(int treeid)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            Stream stream = await gedcomService.GetGedcom(userId, treeid);
            if (stream == null)
                return BadRequest("No autorization, or other error");
            return File(stream, "application/octet-stream");
        }
    }
}
