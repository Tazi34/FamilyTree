using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Helpers;
using FamilyTree.Entities;
using FamilyTree.Models;
using Microsoft.Extensions.Options;
using FamilyTree.Services;
using Microsoft.AspNetCore.Authorization;

namespace FamilyTree.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private UserService userService;
        public UsersController(IUserService userService)
        {
            this.userService = (UserService)userService;
        }
        [HttpGet]
        [Route("")]
        public ActionResult<AuthenticateResponse> GetJWT (AuthenticateRequest model)
        {
            var request = userService.Authenticate(model);
            if (request == null)
                return Unauthorized();
            return Ok(request);
        }
        [HttpPost]
        [Route("")]
        public ActionResult<AuthenticateResponse> Post([FromQuery]CreateUserRequest model)
        {
            var newUser = userService.CreateUser(model);
            if (newUser == null)
                return BadRequest("Not unique email");
            return newUser;
        }
        [HttpGet]
        [Route("facebook")]
        public string Facebook()
        {
            return "facebook test";
        }
        [HttpGet]
        [Route("google")]
        public string Google()
        {
            return "google test";
        }
    }
}