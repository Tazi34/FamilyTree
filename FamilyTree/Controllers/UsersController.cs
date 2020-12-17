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
using System.Security.Claims;

namespace FamilyTree.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private UserService userService;
        private IFacebookService facebookService;
        public UsersController(IUserService userService, IFacebookService facebookService)
        {
            this.userService = (UserService)userService;
            this.facebookService = facebookService;
        }
        /// <summary>
        /// Uzyskanie tokena
        /// </summary>
        /// <param name="email">Email</param>
        /// <param name="password">hasło</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{email}/{password}")]
        public ActionResult<AuthenticateResponse> GetJWT (string email, string password)
        {
            var request = userService.Authenticate(email, password);
            if (request == null)
                return Unauthorized();
            return Ok(request);
        }

        /// <summary>
        /// Uzyskanie informacji o przesłanym w headerze tokenie
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        [Route("")]
        public ActionResult<AuthenticateResponse> CheckJWT()
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var request = userService.CheckUserId(userId);
            if (request == null)
                return Unauthorized();
            return Ok(request);
        }
        /// <summary>
        /// Tworzy nowego użytkownika
        /// </summary>
        /// <param name="model">CreateUserRequest</param>
        /// <returns>Zwraca informacje o użytkowniku i token</returns>
        [HttpPost]
        [Route("")]
        public ActionResult<AuthenticateResponse> Post(CreateUserRequest model)
        {
            var newUser = userService.CreateUser(model);
            if (newUser == null)
                return BadRequest("Not unique email");
            return newUser;
        }
        /// <summary>
        /// TODO
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("facebook/{access_token}")]
        public async Task<ActionResult<AuthenticateResponse>> Facebook(string access_token)
        {
            FacebookUserInfoResult userInfo = await facebookService.GetUserInfo(access_token);
            if (userInfo == null)
                return BadRequest();
            var response = userService.AuthenticateFacebook(userInfo);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
        /// <summary>
        /// TODO
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("google")]
        public string Google()
        {
            return "google test";
        }
    }
}