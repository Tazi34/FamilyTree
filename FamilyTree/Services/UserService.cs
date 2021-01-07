using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using FamilyTree.Helpers;
using FamilyTree.Models;
using FamilyTree.Entities;
using Microsoft.Extensions.Options;

namespace FamilyTree.Services
{
    public interface IUserService
    {
        Task<AuthenticateResponse> AuthenticateAsync(string email, string password);
        Task<AuthenticateResponse> AuthenticateFacebookAsync(FacebookUserInfoResult userInfo);
        User GetUserById(int userId);
        Task<AuthenticateResponse> CreateUserAsync(CreateUserRequest model);
        Task<AuthenticateResponse> ModifyAsync(int userId, ModifyUserRequest model);
        Task<AuthenticateResponse> ChangePasswordAsync(int userId, ChangePasswordRequest model);
        Task<AuthenticateResponse> CheckUserIdAsync(int userId);
        Task<AuthenticateResponse> AuthenticateGoogleAsync(string email);
    }
    public class UserService:IUserService
    {
        private DataContext context;
        private ITokenService tokenService;
        private IPasswordService passwordService;
        private string defaultProfilePictureUrl;

        public UserService(
            DataContext dataContext, 
            ITokenService tokenService, 
            IPasswordService passwordService, 
            IOptions<AzureBlobSettings> azureBlobSettings)
        {
            context = dataContext;
            this.tokenService = tokenService;
            this.passwordService = passwordService;
            defaultProfilePictureUrl = azureBlobSettings.Value.DefaultUserUrl;
        }
        public async Task<AuthenticateResponse> AuthenticateAsync(string email, string password)
        {
            var user = await context.Users.Include(u => u.PrevSurnames).FirstOrDefaultAsync(x => x.Email.Equals(email));
            if (user == null || !passwordService.Compare(user.PasswordHash, password, user.Salt))
                return null;
            return CreateResponse(user);
        }

        public async Task<AuthenticateResponse> AuthenticateFacebookAsync(FacebookUserInfoResult userInfo)
        {
            var user = await context.Users.Include(u => u.PrevSurnames).FirstOrDefaultAsync(u => u.Email.Equals(userInfo.Email));
            if(user == null)
            {
                user = new User
                {
                    Name = userInfo.FirstName,
                    Surname = userInfo.LastName,
                    Email = userInfo.Email,
                    Role = Role.User,
                    PrevSurnames = new List<PreviousSurname>(),
                    PictureUrl = userInfo.Picture.Details.Url.ToString(),
                    Sex = Sex.NotSure,
                    Birthday = DateTime.Now
                };
                context.Users.Add(user);
                await context.SaveChangesAsync();
            }
            return CreateResponse(user);
        }

        public async Task<AuthenticateResponse> AuthenticateGoogleAsync(string email)
        {
            var user = await context.Users.Include(u => u.PrevSurnames).FirstOrDefaultAsync(u => u.Email.Equals(email));
            if(user == null)
            {
                user = new User
                {
                    Email = email,
                    Role = Role.User,
                    PrevSurnames = new List<PreviousSurname>(),
                    Name = "",
                    Surname = "",
                    Sex = Sex.NotSure,
                    Birthday = DateTime.Now
                };
                context.Users.Add(user);
                await context.SaveChangesAsync();
            }
            return CreateResponse(user);
        }

        public async Task<AuthenticateResponse> ChangePasswordAsync(int userId, ChangePasswordRequest model)
        {
            var user = await context.Users.Include(u => u.PrevSurnames).FirstOrDefaultAsync(u => u.UserId == model.UserId);
            var orderingUser = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || !passwordService.Compare(user.PasswordHash, model.OldPassword, user.Salt) || 
                (userId != model.UserId && !orderingUser.Role.Equals(Role.Admin)))
                return null;
            (user.PasswordHash, user.Salt) = passwordService.CreateHash(model.Password);
            context.Users.Update(user);
            await context.SaveChangesAsync();
            return CreateResponse(user);
        }

        public async Task<AuthenticateResponse> CheckUserIdAsync(int userId)
        {
            var user = await context.Users.Include(u => u.PrevSurnames).FirstOrDefaultAsync(u => u.UserId == userId);
            if(user == null)
                return null;
            return CreateResponse(user);
        }

        public async Task<AuthenticateResponse> CreateUserAsync(CreateUserRequest model)
        {
            var sameEmailUser = await context.Users.FirstOrDefaultAsync(u => u.Email.Equals(model.Email));
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
                Sex = model.Sex,
                PictureUrl = defaultProfilePictureUrl
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            return CreateResponse(user);
        }

        public User GetUserById(int userId)
        {
            return context.Users.Include(u => u.PrevSurnames).SingleOrDefault(x => x.UserId == userId);
        }

        public async Task<AuthenticateResponse> ModifyAsync(int userId, ModifyUserRequest model)
        {
            var user = await context.Users.Include(x => x.PrevSurnames).FirstOrDefaultAsync(u => u.UserId == model.UserId);
            var orderingUser = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null || orderingUser == null || (user.UserId != orderingUser.UserId && !orderingUser.Role.Equals(Role.Admin)))
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
                PictureUrl = user.PictureUrl,
                Birthday = user.Birthday
                
            };
        }
    }
}