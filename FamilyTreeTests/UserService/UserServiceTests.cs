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
                    MaidenName = "user1PrevSurname1",
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
                    MaidenName = "MaidenName1",
                    Role = Role.User,
                    Sex = Sex.Female,
                    PasswordHash = "passwd123"
                }
            };
            private byte[] key;
            private JwtSecurityTokenHandler handler;
            private TokenValidationParameters validations;
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
            public async void AuthenticateSuccess(User user)
            {
                var response = await service.AuthenticateAsync(user.Email, user.PasswordHash);

                Assert.IsNotNull(response);
                Assert.AreEqual(response.Name, user.Name);
                CheckToken(response.Token, user.UserId);
            }
            [Test]
            public async void AuthenticateFail()
            {
                var response = await service.AuthenticateAsync("DummyEmail", "DummyPasswd");
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
                var response = await service.ChangePasswordAsync(user.UserId, request);

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
                var response = await service.ChangePasswordAsync(666, request);

                mockSetUser.Verify(x => x.Update(It.IsAny<User>()), Times.Never);
                mockContext.Verify(x => x.SaveChanges(), Times.Never);
                Assert.IsNull(response);
            }
            [TestCaseSource("Users")]
            public async void CheckUserIdSuccess(User user)
            {
                var response = await service.CheckUserIdAsync(user.UserId);
                Assert.IsNotNull(response);
                Assert.AreEqual(response.UserId, user.UserId);
                CheckToken(response.Token, user.UserId);
            }
            [Test]
            public async void CheckUserIdFail()
            {
                var response = await service.CheckUserIdAsync (666);
                Assert.IsNull(response);
            }
            [Test]
            public async void CreateUserSuccess()
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
                mockSetUser.Verify(x => x.Add(It.IsAny<User>()), Times.Once);
                mockContext.Verify(x => x.SaveChanges(), Times.Once);
                Assert.IsNotNull(response);
                CheckToken(response.Token, response.UserId);
            }
            [TestCaseSource("Users")]
            public async void CreateUserFail(User user)
            {
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
            public async void GetUserByIdFail()
            {
                var response = await service.CheckUserIdAsync(666);
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
                    MaidenName = user.MaidenName,
                    UserId = user.UserId
                };
                var response = await service.ModifyAsync(user.UserId, request);
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
                    MaidenName = "NewPrevSurname",
                    UserId = 666
                };
                var response = await service.ModifyAsync(666, request);
                mockSetUser.Verify(x => x.Update(It.IsAny<User>()), Times.Never);
                mockContext.Verify(x => x.SaveChanges(), Times.Never);
                Assert.IsNull(response);
            }
        }
    }
}