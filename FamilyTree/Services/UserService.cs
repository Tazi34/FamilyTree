using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Helpers;
using FamilyTree.Models;
using FamilyTree.Entities;
namespace FamilyTree.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest auth_request);
        User GetById(int user_id);
        AuthenticateResponse CreateUser(CreateUserRequest model);
        AuthenticateResponse Modify(ModifyUserRequest model);
        AuthenticateResponse ChangePassword(ChangePasswordRequest model);
    }
    public class UserService:IUserService
    {
        private DataContext _context;
        private ITokenService _token_service;

        public UserService(DataContext context, ITokenService token_service)
        {
            _context = context;
            _token_service = token_service;
        }
        public AuthenticateResponse Authenticate(AuthenticateRequest auth_request)
        {
            var user = _context.Users.SingleOrDefault(x => x.Email == auth_request.Email);

            if (user == null)
                return null;

            if (user.PasswordHash != auth_request.Password)
                return null;

            return new AuthenticateResponse
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                Token = _token_service.GetToken(user.UserId)
            };
        }

        public AuthenticateResponse ChangePassword(ChangePasswordRequest model)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == model.UserId && u.Email.Equals(model.Email) && u.PasswordHash.Equals(model.OldPassword));
            if (user == null)
                return null;

            user.PasswordHash = model.Password;
            _context.Users.Update(user);
            _context.SaveChanges();
            return Authenticate(new AuthenticateRequest
            {
                Email = model.Email,
                Password = model.Password
            });
        }

        public AuthenticateResponse CreateUser(CreateUserRequest model)
        {
            var same_email_user = _context.Users.SingleOrDefault(u => u.Email.Equals(model.Email));
            if (same_email_user != null)
                return null;
            var user1 = new User
            {
                Name = model.Name,
                Surname = model.Surname,
                Email = model.Email,
                PasswordHash = model.Password,
                Role = Role.User,
                Birthday = model.Birthday
            };
            _context.Users.Add(user1);
            _context.SaveChanges();
            return Authenticate(new AuthenticateRequest
            {
                Email = model.Email,
                Password = model.Password
            });
        }

        public User GetById(int user_id)
        {
            return _context.Users.SingleOrDefault(x => x.UserId == user_id);
        }

        public AuthenticateResponse Modify(ModifyUserRequest model)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == model.UserId);
            if (user == null)
                return null;

            if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
            {
                if (_context.Users.Any(x => x.Email.Equals(model.Email)))
                    return null;

                user.Email = model.Email;
            }

            if (!string.IsNullOrWhiteSpace(model.Name))
                user.Name = model.Name;
            if (!string.IsNullOrWhiteSpace(model.Surname))
                user.Surname = model.Surname;
            if (model.Birthday != null)
                user.Birthday = model.Birthday;
            _context.Users.Update(user);
            _context.SaveChanges();
            return Authenticate(new AuthenticateRequest
            {
                Email = user.Email,
                Password = user.PasswordHash
            });
        }
    }
}