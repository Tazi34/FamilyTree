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
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EditUsersController : ControllerBase
    {
        private IUserService userService;
        private IPictureService pictureService;
        public EditUsersController(DataContext context, IUserService userService, IPictureService pictureService)
        {
            this.userService = userService;
            this.pictureService = pictureService;
        }
        /// <summary>
        /// Modyfikacja informacji o użytkowniku
        /// </summary>
        /// <param name="model">ModifyUserRequest</param>
        /// <returns>Zwraca token i zmodyfikowane informacje o użytkowniku</returns>
        [HttpPut]
        [Authorize]
        [Route("")]
        public async Task<ActionResult<AuthenticateResponse>> ModifyUser(ModifyUserRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            if (userId != model.UserId)
                return Unauthorized();
            var result = await userService.ModifyAsync(model);
            if (result == null)
                return BadRequest();
            return result;
        }
        /// <summary>
        /// Zmiana hasła
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Zwraca token i informacje o użytkowniku</returns>
        [HttpPut]
        [Authorize]
        [Route("passwordChange")]
        public async Task<ActionResult<AuthenticateResponse>> ChangePassword(ChangePasswordRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            if (userId != model.UserId)
                return Unauthorized();
            var result = await userService.ChangePasswordAsync(model);
            if (result == null)
                return BadRequest();
            return result;
        }
        /// <summary>
        /// Endpoint do zmiany zdjęcia profilowego
        /// </summary>
        [HttpPost]
        [Route("picture")]
        [Authorize]
        public async Task<ActionResult<SetPictureResponse>> SetUserPicture(IFormFile picture)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var response = await pictureService.SetProfilePicture(userId, picture);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
    }
}