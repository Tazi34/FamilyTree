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
        AuthenticateResponse AuthenticateFacebook(FacebookUserInfoResult userInfo);
        User GetUserById(int userId);
        AuthenticateResponse CreateUser(CreateUserRequest model);
        Task<AuthenticateResponse> ModifyAsync(ModifyUserRequest model);
        Task<AuthenticateResponse> ChangePasswordAsync(ChangePasswordRequest model);
        AuthenticateResponse CheckUserId(int userId);
        AuthenticateResponse AuthenticateGoogle(string email);
    }
    public class UserService:IUserService
    {
        private DataContext context;
        private ITokenService tokenService;
        private IPasswordService passwordService;

        public UserService(DataContext dataContext, ITokenService tokenService, IPasswordService passwordService)
        {
            context = dataContext;
            this.tokenService = tokenService;
            this.passwordService = passwordService;
        }
        public AuthenticateResponse Authenticate(string email, string password)
        {
            var user = context.Users.Include(u => u.PrevSurnames).SingleOrDefault(x => x.Email.Equals(email));
            if (user == null || !passwordService.Compare(user.PasswordHash, password, user.Salt))
                return null;

            return CreateResponse(user);
        }

        public AuthenticateResponse AuthenticateFacebook(FacebookUserInfoResult userInfo)
        {
            var user = context.Users.Include(u => u.PrevSurnames).SingleOrDefault(u => u.Email.Equals(userInfo.Email));
            if(user == null)
            {
                user = new User
                {
                    Name = userInfo.FirstName,
                    Surname = userInfo.LastName,
                    Email = userInfo.Email,
                    Role = Role.User,
                    PrevSurnames = new List<PreviousSurname>(),
                    PictureUrl = userInfo.Picture.Details.Url.ToString()
                };
                context.Users.Add(user);
                context.SaveChanges();
                return CreateResponse(user);
            }
            user.PictureUrl = userInfo.Picture.Details.Url.ToString();
            user.Name = userInfo.FirstName;
            user.Surname = userInfo.LastName;
            context.Users.Update(user);
            context.SaveChanges();
            return CreateResponse(user);
        }

        public AuthenticateResponse AuthenticateGoogle(string email)
        {
            var user = context.Users.Include(u => u.PrevSurnames).SingleOrDefault(u => u.Email.Equals(email));
            if(user == null)
            {
                user = new User
                {
                    Email = email,
                    Role = Role.User,
                    PrevSurnames = new List<PreviousSurname>()
                };
                context.Users.Add(user);
                context.SaveChanges();
            }
            return CreateResponse(user);
        }

        public async Task<AuthenticateResponse> ChangePasswordAsync(ChangePasswordRequest model)
        {
            var user = await context.Users.Include(u => u.PrevSurnames).FirstOrDefaultAsync(u => u.UserId == model.UserId);
            if (user == null || !passwordService.Compare(user.PasswordHash, model.OldPassword, user.Salt))
                return null;
            (user.PasswordHash, user.Salt) = passwordService.CreateHash(model.Password);
            context.Users.Update(user);
            await context.SaveChangesAsync();
            return CreateResponse(user);
        }

        public AuthenticateResponse CheckUserId(int userId)
        {
            var user = context.Users.Include(u => u.PrevSurnames).SingleOrDefault(u => u.UserId == userId);
            if(user == null)
                return null;
            return CreateResponse(user);
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
            var hashSaltTuple = passwordService.CreateHash(model.Password);
            var user = new User
            {
                Name = model.Name,
                Surname = model.Surname,
                Email = model.Email,
                PasswordHash = hashSaltTuple.Item1,
                Salt = hashSaltTuple.Item2,
                Role = Role.User,
                Birthday = model.Birthday,
                PrevSurnames = previousSurnames,
                Sex = model.Sex
            };
            context.Users.Add(user);
            context.SaveChanges();
            return CreateResponse(user);
        }

        public User GetUserById(int userId)
        {
            return context.Users.Include(u => u.PrevSurnames).SingleOrDefault(x => x.UserId == userId);
        }

        public async Task<AuthenticateResponse> ModifyAsync(ModifyUserRequest model)
        {
            var user = await context.Users.Include(x => x.PrevSurnames).FirstOrDefaultAsync(u => u.UserId == model.UserId);
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
            if (!string.IsNullOrWhiteSpace(model.Sex))
                user.Sex = model.Sex;
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
            await context.SaveChangesAsync();
            return CreateResponse(user);
        }
        private AuthenticateResponse CreateResponse(User user)
        {
            return new AuthenticateResponse
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                Token = tokenService.GetToken(user.UserId),
                Role = user.Role,
                PreviousSurnames = user.PrevSurnames?.Select(x => x.Surname).ToList(),
                PictureUrl = user.PictureUrl
            };
        }
    }
}