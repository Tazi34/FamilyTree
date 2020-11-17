﻿using System;
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
        private DataContext db_context;
        private AppSettings app_settings;
        private TokenService token_service;
        private UserService user_service;
        public UsersController(DataContext context, IOptions<AppSettings> _appsettings, ITokenService token_serv, IUserService user_serv)
        {
            db_context = context;
            app_settings = _appsettings.Value;
            token_service = (TokenService)token_serv;
            user_service = (UserService)user_serv;
        }
        [HttpGet]
        [Route("")]
        public ActionResult<AuthenticateResponse> GetJWT (AuthenticateRequest model)
        {
            var request = user_service.Authenticate(model);
            if (request == null)
                return Unauthorized();
            return Ok(request);
        }
        [HttpPost]
        [Route("")]
        public ActionResult<AuthenticateResponse> Post(CreateUserRequest model)
        {
            var new_user = user_service.CreateUser(model);
            if (new_user == null)
                return BadRequest("Not unique email");
            return new_user;
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