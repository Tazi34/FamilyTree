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
        AuthenticateResponse Authenticate(string email, string password);
        User GetById(int userId);
        AuthenticateResponse CreateUser(CreateUserRequest model);
        AuthenticateResponse Modify(ModifyUserRequest model);
        AuthenticateResponse ChangePassword(ChangePasswordRequest model);
    }
    public class UserService:IUserService
    {
        private DataContext context;
        private ITokenService tokenService;

        public UserService(DataContext dataContext, ITokenService tokenService)
        {
            context = dataContext;
            this.tokenService = tokenService;
        }
        public AuthenticateResponse Authenticate(string email, string password)
        {
            var user = context.Users.Include(x => x.PrevSurnames).SingleOrDefault(x => x.Email.Equals(email));

            if (user == null)
                return null;

            if (user.PasswordHash != password)
                return null;

            return new AuthenticateResponse
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                Token = tokenService.GetToken(user.UserId),
                Role = user.Role,
                PreviousSurnames = user.PrevSurnames.Select(x => x.Surname).ToList()
            };
        }

        public AuthenticateResponse ChangePassword(ChangePasswordRequest model)
        {
            var user = context.Users.SingleOrDefault(u => u.UserId == model.UserId && u.Email.Equals(model.Email) && u.PasswordHash.Equals(model.OldPassword));
            if (user == null)
                return null;

            user.PasswordHash = model.Password;
            context.Users.Update(user);
            context.SaveChanges();
            return Authenticate(model.Email, model.Password);
        }

        public AuthenticateResponse CreateUser(CreateUserRequest model)
        {
            var sameEmailUser = context.Users.SingleOrDefault(u => u.Email.Equals(model.Email));
            if (sameEmailUser != null)
                return null;
            var previousSurnames = new List<PreviousSurname>();
            if(model.PreviousSurnames != null)
            {
                foreach (string surname in model.PreviousSurnames)
                {
                    previousSurnames.Add(new PreviousSurname
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
                PrevSurnames = previousSurnames
            };
            context.Users.Add(user1);
            context.SaveChanges();
            return Authenticate(model.Email, model.Password);
        }

        public User GetById(int userId)
        {
            return context.Users.SingleOrDefault(x => x.UserId == userId);
        }

        public AuthenticateResponse Modify(ModifyUserRequest model)
        {
            var user = context.Users.Include(x => x.PrevSurnames).SingleOrDefault(u => u.UserId == model.UserId);
            if (user == null)
                return null;

            if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
            {
                if (context.Users.Any(x => x.Email.Equals(model.Email)))
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
                    bool newSurname = true;
                    foreach(PreviousSurname s in user.PrevSurnames)
                    {
                        if (s.Surname.Equals(surname))
                        {
                            newSurname = false;
                            break;
                        }
                    }
                    if (newSurname)
                    {
                        user.PrevSurnames.Add(new PreviousSurname
                        {
                            Surname = surname
                        });
                    }
                }
            }

            context.Users.Update(user);
            context.SaveChanges();
            return Authenticate(user.Email, user.PasswordHash);
        }
    }
}