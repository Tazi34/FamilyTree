using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Helpers;
using FamilyTree.Models;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EditUsersController : ControllerBase
    {
        private DataContext db_context;
        public EditUsersController(DataContext context)
        {
            db_context = context;
        }
        [HttpPut]
        [Route("")]
        public AuthenticateResponse ModifyUser(ModifyUserRequest model)
        {
            var user = db_context.Users.SingleOrDefault(user => user.UserId == model.UserId);
            user.Name = model.Name;
            user.Email = model.Email;
            user.Surname = model.Surname;
            db_context.SaveChanges();
            return new AuthenticateResponse
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Surname = user.Surname
            };
        }
        [HttpPut]
        [Route("password_change")]
        public AuthenticateResponse ChangePassword(ChangePasswordRequest model)
        {
            var user = db_context.Users.SingleOrDefault(user => user.UserId == model.UserId);
            db_context.SaveChanges();
            return new AuthenticateResponse
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Surname = user.Surname
            };
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