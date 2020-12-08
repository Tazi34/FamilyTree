using System;
using System.Collections.Generic;
using System.Text;
using NUnit.Framework;
using FamilyTree.Helpers;
using FamilyTree.Services;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace FamilyTreeTests.Token
{
    class TokenServiceTests
    {
        private AppSettings appsettings = new AppSettings { Secret = "TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST_TEST" };
        private TokenService service;
        private byte[] key;
        private JwtSecurityTokenHandler handler;
        private TokenValidationParameters validations;
        [SetUp]
        public void Setup()
        {
            service = new TokenService(appsettings);
            key = Encoding.ASCII.GetBytes(appsettings.Secret);
            handler = new JwtSecurityTokenHandler();
            validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        }
        [TestCase(1)]
        [TestCase(4294967296)]
        public void GenerateToken1(long userId)
        {
            string tokenString = service.GetToken(userId);

            Assert.IsNotNull(tokenString);

            var claims = handler.ValidateToken(tokenString, validations, out var tokenSecure);
            var userIdFromToken = Int64.Parse(claims.Identity.Name);

            Assert.AreEqual(userId, userIdFromToken);
        }
    }
}