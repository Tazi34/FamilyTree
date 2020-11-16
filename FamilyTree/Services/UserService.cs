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

            //if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            //    return null;

            // authentication successful
            return new AuthenticateResponse
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                Token = _token_service.GetToken(user.UserId)
            };
        }

        public User GetById(int user_id)
        {
            return _context.Users.SingleOrDefault(x => x.UserId == user_id);
        }
    }
}
