using NUnit.Framework;
using FamilyTree.Services;
using Moq;
using FamilyTree.Entities;
using FamilyTree.Helpers;
using FamilyTree.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;

namespace FamilyTreeTests.UserServiceTests
{
    class UserServiceTests
    {
        public class Tests
        {
            private UserService service;
            private TokenService tokenService;
            private AppSettings appSettings = new AppSettings { Secret = "TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST" };
            private List<User> Users = new List<User>
            {
                new User
                    {
                        Name = "TestName1",
                        Surname = "TestSurname1",
                        Email = "test1@mail",
                        Birthday = DateTime.Now,
                        MaidenName = "user1PrevSurname1",
                        Role = Role.User,
                        Sex = Sex.NotSure,
                        PasswordHash = "passwd123"
                    },
                new User
                    {
                        Name = "TestName2",
                        Surname = "TestSurname2",
                        Email = "test2@mail",
                        Birthday = DateTime.Now,
                        MaidenName = "MaidenName1",
                        Role = Role.User,
                        Sex = Sex.Female,
                        PasswordHash = "passwd123"
                    }
        };
            private byte[] key;
            private JwtSecurityTokenHandler handler;
            private TokenValidationParameters validations;
            private DbContextOptions<DataContext> contextOptions = new DbContextOptionsBuilder<DataContext>().UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=UnitTestsFamilyTree;Trusted_Connection=True;").Options;
            private DataContext context;
            private void Seed()
            {
                using (var context = new DataContext(contextOptions))
                {
                    context.Database.EnsureDeleted();
                    context.Database.EnsureCreated();

                    Users[0] = new User
                    {
                        Name = "TestName1",
                        Surname = "TestSurname1",
                        Email = "test1@mail",
                        Birthday = DateTime.Now,
                        MaidenName = "user1PrevSurname1",
                        Role = Role.User,
                        Sex = Sex.NotSure,
                        PasswordHash = "passwd123"
                    };
                    Users[1] = new User
                    {
                        Name = "TestName2",
                        Surname = "TestSurname2",
                        Email = "test2@mail",
                        Birthday = DateTime.Now,
                        MaidenName = "MaidenName1",
                        Role = Role.User,
                        Sex = Sex.Female,
                        PasswordHash = "passwd123"
                    };
                    context.Users.AddRange(Users[0], Users[1]);
                    context.SaveChanges();
                }
            }
            [SetUp]
            public void Setup()
            {
                tokenService = new TokenService(appSettings);
                context = new DataContext(contextOptions);
                Seed();
                service = new UserService(context, tokenService, new PasswordService());

                key = Encoding.ASCII.GetBytes(appSettings.Secret);
                handler = new JwtSecurityTokenHandler();
                validations = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            }
            [TearDown]
            public void TearDown()
            {
                context.Dispose();
            }
            private void CheckToken(string token, long userId)
            {
                Assert.IsNotNull(token);

                var claims = handler.ValidateToken(token, validations, out var tokenSecure);
                var userIdFromToken = long.Parse(claims.Identity.Name);

                Assert.AreEqual(userId, userIdFromToken);
            }
            public async Task AuthenticateSuccess()
            {
                var user = Users[0];
                var request = new CreateUserRequest()
                {
                    Birthday = DateTime.Now,
                    Email = "email" + user.Email,
                    MaidenName = "",
                    Name = user.Name,
                    Password = user.PasswordHash,
                    Sex = user.Sex,
                    Surname = user.Surname
                };
                await service.CreateUserAsync(request);
                var response = await service.AuthenticateAsync(request.Email, request.Password);

                Assert.IsNotNull(response);
                Assert.AreEqual(response.Name, user.Name);
                CheckToken(response.Token, response.UserId);
            }
            [Test]
            public async Task AuthenticateFail()
            {
                var response = await service.AuthenticateAsync("DummyEmail", "DummyPasswd");
                Assert.IsNull(response);
            }
            public async Task ChangePasswordSuccess()
            {
                var user = Users[0];
                var request1 = new CreateUserRequest()
                {
                    Birthday = DateTime.Now,
                    Email = "email" + user.Email,
                    MaidenName = "",
                    Name = user.Name,
                    Password = user.PasswordHash,
                    Sex = user.Sex,
                    Surname = user.Surname
                };
                var response1 = await service.CreateUserAsync(request1);

                var request2 = new ChangePasswordRequest
                {
                    Email = request1.Email,
                    UserId = response1.UserId,
                    OldPassword = request1.Password,
                    Password = "superNewPasswd"
                };
                var response2 = await service.ChangePasswordAsync(response1.UserId, request2);

                Assert.IsNotNull(response2);
                Assert.AreEqual(response2.UserId, response1.UserId);
                CheckToken(response2.Token, response1.UserId);
            }
            [Test]
            public async Task ChangePasswordFail()
            {
                var request = new ChangePasswordRequest
                {
                    Email = "DummyEmail",
                    UserId = 666,
                    OldPassword = "DummyPasswd",
                    Password = "superNewPasswd"
                };
                var response = await service.ChangePasswordAsync(666, request);
                Assert.IsNull(response);
            }
            public async Task CheckUserIdSuccess()
            {
                var user = Users[0];
                var response = await service.CheckUserIdAsync(user.UserId);
                Assert.IsNotNull(response);
                Assert.AreEqual(response.UserId, user.UserId);
                CheckToken(response.Token, user.UserId);
            }
            [Test]
            public async Task CheckUserIdFail()
            {
                var response = await service.CheckUserIdAsync (666);
                Assert.IsNull(response);
            }
            [Test]
            public async Task CreateUserSuccess()
            {
                var request = new CreateUserRequest
                {
                    Birthday = DateTime.Now,
                    Email = "new@Email",
                    Name = "NewName",
                    Surname = "NewSurname",
                    Password = "NewPasswd",
                    Sex = "Male",
                    MaidenName = "Prev1"
                };
                var response = await service.CreateUserAsync(request);
                Assert.IsNotNull(response);
                CheckToken(response.Token, response.UserId);
            }
            public async Task CreateUserFail()
            {
                var user = Users[0];
                var request = new CreateUserRequest
                {
                    Birthday = user.Birthday,
                    Email = user.Email,
                    Name = user.Name,
                    Surname = user.Surname,
                    Password = user.PasswordHash,
                    Sex = user.Sex,
                    MaidenName = user.MaidenName
                };
                var response = await service.CreateUserAsync(request);
                Assert.IsNull(response);
            }
            public void GetUserByIdSuccess()
            {
                var user = Users[0];
                var response = service.GetUserById(user.UserId);
                Assert.IsNotNull(response);
                Assert.AreEqual(response.UserId, user.UserId);
            }
            [Test]
            public async Task GetUserByIdFail()
            {
                var response = await service.CheckUserIdAsync(666);
                Assert.IsNull(response);
            }
            public async Task ModifySuccess()
            {
                var user = Users[0];
                var request = new ModifyUserRequest
                {
                    Birthday = user.Birthday,
                    Email = user.Email,
                    Name = "NewName",
                    Surname = user.Surname,
                    Sex = user.Sex,
                    MaidenName = user.MaidenName,
                    UserId = user.UserId
                };
                var response = await service.ModifyAsync(user.UserId, request);
                Assert.IsNotNull(response);
                CheckToken(response.Token, user.UserId);
                Assert.AreEqual(response.Email, user.Email);
                Assert.AreEqual(response.Name, "NewName");
            }
            [Test]
            public async Task ModifyFail ()
            {
                var request = new ModifyUserRequest
                {
                    MaidenName = "NewPrevSurname",
                    UserId = 666
                };
                var response = await service.ModifyAsync(666, request);
                Assert.IsNull(response);
            }
        }
    }
}