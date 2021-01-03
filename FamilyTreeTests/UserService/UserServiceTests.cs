using NUnit.Framework;
using FamilyTree.Services;
using Moq;
using FamilyTree.Entities;
using FamilyTree.Helpers;
using FamilyTree.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using FamilyTreeTests.Helpers;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FamilyTreeTests.UserServiceTests
{
    class UserServiceTests
    {
        public class Tests
        {
            private UserService service;
            private TokenService tokenService;
            private AppSettings appSettings = new AppSettings { Secret = "TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST" };
            private Mock<DbSet<User>> mockSetUser;
            private Mock<DataContext> mockContext;
            private static List<User> Users = new List<User>
            {
                new User
                {
                    UserId = 1,
                    Name = "TestName1",
                    Surname = "TestSurname1",
                    Email = "test1@mail",
                    Birthday = DateTime.Now,
                    PrevSurnames = new List<PreviousSurname>
                    {
                        new PreviousSurname
                        {
                            UserId = 1,
                            PreviousSurnameId = 1,
                            Surname = "user1PrevSurname1"
                        },
                        new PreviousSurname
                        {
                            UserId = 1,
                            PreviousSurnameId = 2,
                            Surname = "user1PrevSurname2"
                        },
                    },
                    Role = Role.User,
                    Sex = Sex.NotSure,
                    PasswordHash = "passwd123"
                },
                new User
                {
                    UserId = 2,
                    Name = "TestName2",
                    Surname = "TestSurname2",
                    Email = "test2@mail",
                    Birthday = DateTime.Now,
                    PrevSurnames = new List<PreviousSurname>
                    {
                        new PreviousSurname
                        {
                            UserId = 2,
                            PreviousSurnameId = 3,
                            Surname = "user2PrevSurname1"
                        },
                        new PreviousSurname
                        {
                            UserId = 2,
                            PreviousSurnameId = 4,
                            Surname = "user2PrevSurname2"
                        },
                    },
                    Role = Role.User,
                    Sex = Sex.Female,
                    PasswordHash = "passwd123"
                }
            };
            private byte[] key;
            private JwtSecurityTokenHandler handler;
            private TokenValidationParameters validations;
            //private static User user1 = new User
            //{
            //    UserId = 1,
            //    Name = "TestName1",
            //    Surname = "TestSurname1",
            //    Email = "test1@mail",
            //    Birthday = DateTime.Now,
            //    PrevSurnames = new List<PreviousSurname> 
            //    {
            //        new PreviousSurname
            //        {
            //            UserId = 1,
            //            PreviousSurnameId = 1,
            //            Surname = "user1PrevSurname1"
            //        },
            //        new PreviousSurname
            //        {
            //            UserId = 1,
            //            PreviousSurnameId = 2,
            //            Surname = "user1PrevSurname2"
            //        },
            //    },
            //    Role = Role.User,
            //    Sex = Sex.NotSure,
            //    PasswordHash = "passwd123"
            //};
            //private static User user2 = new User
            //{
            //    UserId = 2,
            //    Name = "TestName2",
            //    Surname = "TestSurname2",
            //    Email = "test2@mail",
            //    Birthday = DateTime.Now,
            //    PrevSurnames = new List<PreviousSurname>
            //    {
            //        new PreviousSurname
            //        {
            //            UserId = 2,
            //            PreviousSurnameId = 3,
            //            Surname = "user2PrevSurname1"
            //        },
            //        new PreviousSurname
            //        {
            //            UserId = 2,
            //            PreviousSurnameId = 4,
            //            Surname = "user2PrevSurname2"
            //        },
            //    },
            //    Role = Role.User,
            //    Sex = Sex.Female,
            //    PasswordHash = "passwd123"
            //};
            [SetUp]
            public void Setup()
            {
                mockSetUser = CreateDbMock.Create(Users);

                mockContext = new Mock<DataContext>();
                mockContext.Setup(m => m.Users).Returns(mockSetUser.Object);

                tokenService = new TokenService(appSettings);
                service = new UserService(mockContext.Object, tokenService, new PasswordService());

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
            private void CheckToken(string token, long userId)
            {
                Assert.IsNotNull(token);

                var claims = handler.ValidateToken(token, validations, out var tokenSecure);
                var userIdFromToken = long.Parse(claims.Identity.Name);

                Assert.AreEqual(userId, userIdFromToken);
            }
            [TestCaseSource("Users")]
            public void AuthenticateSuccess(User user)
            {
                var response = service.Authenticate(user.Email, user.PasswordHash);

                Assert.IsNotNull(response);
                Assert.AreEqual(response.Name, user.Name);
                CheckToken(response.Token, user.UserId);
            }
            [Test]
            public void AuthenticateFail()
            {
                var response = service.Authenticate("DummyEmail", "DummyPasswd");
                Assert.IsNull(response);
            }
            [TestCaseSource("Users")]
            public async void ChangePasswordSuccess(User user)
            {
                var request = new ChangePasswordRequest
                {
                    Email = user.Email,
                    UserId = user.UserId,
                    OldPassword = user.PasswordHash,
                    Password = "superNewPasswd"
                };
                var response = await service.ChangePasswordAsync(request);

                mockSetUser.Verify(x => x.Update(It.IsAny<User>()), Times.Once);
                mockContext.Verify(x => x.SaveChanges(), Times.Once);
                Assert.IsNotNull(response);
                Assert.AreEqual(response.UserId, user.UserId);
                CheckToken(response.Token, user.UserId);
            }
            [Test]
            public async void ChangePasswordFail()
            {
                var request = new ChangePasswordRequest
                {
                    Email = "DummyEmail",
                    UserId = 666,
                    OldPassword = "DummyPasswd",
                    Password = "superNewPasswd"
                };
                var response = await service.ChangePasswordAsync(request);

                mockSetUser.Verify(x => x.Update(It.IsAny<User>()), Times.Never);
                mockContext.Verify(x => x.SaveChanges(), Times.Never);
                Assert.IsNull(response);
            }
            [TestCaseSource("Users")]
            public void CheckUserIdSuccess(User user)
            {
                var response = service.CheckUserId(user.UserId);
                Assert.IsNotNull(response);
                Assert.AreEqual(response.UserId, user.UserId);
                CheckToken(response.Token, user.UserId);
            }
            [Test]
            public void CheckUserIdFail()
            {
                var response = service.CheckUserId(666);
                Assert.IsNull(response);
            }
            [Test]
            public void CreateUserSuccess()
            {
                var request = new CreateUserRequest
                {
                    Birthday = DateTime.Now,
                    Email = "new@Email",
                    Name = "NewName",
                    Surname = "NewSurname",
                    Password = "NewPasswd",
                    Sex = "Male",
                    PreviousSurnames = new List<string> {
                        "Prev1", "Prev2"
                    }
                };
                var response = service.CreateUser(request);
                mockSetUser.Verify(x => x.Add(It.IsAny<User>()), Times.Once);
                mockContext.Verify(x => x.SaveChanges(), Times.Once);
                Assert.IsNotNull(response);
                CheckToken(response.Token, response.UserId);
            }
            [TestCaseSource("Users")]
            public void CreateUserFail(User user)
            {
                var request = new CreateUserRequest
                {
                    Birthday = user.Birthday,
                    Email = user.Email,
                    Name = user.Name,
                    Surname = user.Surname,
                    Password = user.PasswordHash,
                    Sex = user.Sex,
                    PreviousSurnames = new List<string> {
                        user.PrevSurnames[0].Surname, user.PrevSurnames[1].Surname
                    }
                };
                var response = service.CreateUser(request);
                mockSetUser.Verify(x => x.Add(It.IsAny<User>()), Times.Never);
                mockContext.Verify(x => x.SaveChanges(), Times.Never);
                Assert.IsNull(response);
            }
            [TestCaseSource("Users")]
            public void GetUserByIdSuccess(User user)
            {
                var response = service.GetUserById(user.UserId);
                Assert.IsNotNull(response);
                Assert.AreEqual(response.UserId, user.UserId);
            }
            [Test]
            public void GetUserByIdFail()
            {
                var response = service.CheckUserId(666);
                Assert.IsNull(response);
            }
            [TestCaseSource("Users")]
            public async void ModifySuccess(User user)
            {
                var request = new ModifyUserRequest
                {
                    Birthday = user.Birthday,
                    Email = user.Email,
                    Name = "NewName",
                    Surname = user.Surname,
                    Sex = user.Sex,
                    PreviousSurnames = new List<string> {
                        user.PrevSurnames[0].Surname, user.PrevSurnames[1].Surname, "NewPrevSurname"
                    },
                    UserId = user.UserId
                };
                var response = await service.ModifyAsync(request);
                mockSetUser.Verify(x => x.Update(It.IsAny<User>()), Times.Once);
                mockContext.Verify(x => x.SaveChanges(), Times.Once);
                Assert.IsNotNull(response);
                CheckToken(response.Token, user.UserId);
                Assert.AreEqual(response.Email, user.Email);
                Assert.AreEqual(response.Name, "NewName");
            }
            [Test]
            public async void ModifyFail ()
            {
                var request = new ModifyUserRequest
                {
                    PreviousSurnames = new List<string> {
                        "NewPrevSurname"
                    },
                    UserId = 666
                };
                var response = await service.ModifyAsync(request);
                mockSetUser.Verify(x => x.Update(It.IsAny<User>()), Times.Never);
                mockContext.Verify(x => x.SaveChanges(), Times.Never);
                Assert.IsNull(response);
            }
        }
    }
}