using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
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
        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            //var user = _context.Users.SingleOrDefault(x => x.Email == model.Email);
            var user = _context.Users.Include(x => x.PrevSurnames).SingleOrDefault(x => x.Email.Equals(model.Email));

            if (user == null)
                return null;

            if (user.PasswordHash != model.Password)
                return null;

            return new AuthenticateResponse
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                Token = _token_service.GetToken(user.UserId),
                Role = user.Role,
                PreviousSurnames = user.PrevSurnames.Select(x => x.Surname).ToList()
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
            var prev_surnames = new List<PreviousSurname>();
            if(model.PreviousSurnames != null)
            {
                foreach (string surname in model.PreviousSurnames)
                {
                    prev_surnames.Add(new PreviousSurname
                    {
                        Surname = surname
                    });
                }
            }
            var user1 = new User
            {
                Name = model.Name,
                Surname = model.Surname,
                Email = model.Email,
                PasswordHash = model.Password,
                Role = Role.User,
                Birthday = model.Birthday,
                PrevSurnames = prev_surnames
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
            var user = _context.Users.Include(x => x.PrevSurnames).SingleOrDefault(u => u.UserId == model.UserId);
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
            if (model.PreviousSurnames != null)
            {
                foreach(string surname in model.PreviousSurnames)
                {
                    bool add_surname = true;
                    foreach(PreviousSurname s in user.PrevSurnames)
                    {
                        if (s.Surname.Equals(surname))
                        {
                            add_surname = false;
                            break;
                        }
                    }
                    if (add_surname)
                    {
                        user.PrevSurnames.Add(new PreviousSurname
                        {
                            Surname = surname
                        });
                    }
                }
            }

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