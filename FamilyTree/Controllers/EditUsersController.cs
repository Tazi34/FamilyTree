using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Helpers;
using FamilyTree.Models;
using FamilyTree.Services;
using System.Security.Claims;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EditUsersController : ControllerBase
    {
        private UserService userService;
        public EditUsersController(DataContext context, IUserService userService)
        {
            this.userService = (UserService)userService;
        }
        [HttpPut]
        [Route("")]
        public ActionResult<AuthenticateResponse> ModifyUser(ModifyUserRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            if (userId != model.UserId)
                return Unauthorized();
            var result = userService.Modify(model);
            if (result == null)
                return BadRequest();
            return result;
        }
        [HttpPut]
        [Route("passwordChange")]
        public ActionResult<AuthenticateResponse> ChangePassword(ChangePasswordRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            if (userId != model.UserId)
                return Unauthorized();
            var result = userService.ChangePassword(model);
            if (result == null)
                return BadRequest();
            return result;
        }
        [HttpPost]
        [Route("picture")]
        public void SetUserPicture()
        {

        }
        [HttpPut]
        [Route("picture")]
        public void ChangeUserPicture()
        {

        }
        [HttpGet]
        [Route("picture/{UserId}")]
        public void ChangeUserPicture(int UserId)
        {

        }
    }
}