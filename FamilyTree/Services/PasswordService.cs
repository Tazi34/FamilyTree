using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace FamilyTree.Services
{
    public interface IPasswordService
    {
        public bool Compare(string hash, string givenPassword, string salt);
        public (string, string) CreateHash(string password);
    }
    public class PasswordService : IPasswordService
    {
        public bool Compare(string hash, string givenPassword, string salt)
        {
            string computedHash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: givenPassword,
                    salt: Convert.FromBase64String(salt),
                    prf: KeyDerivationPrf.HMACSHA1,
                    iterationCount: 10000,
                    numBytesRequested: 256 / 8));
            return computedHash.Equals(hash) ? true : false;
        }

        /// <summary>
        /// CreateHash
        /// </summary>
        /// <param name="password"></param>
        /// <returns>Tuple: var1 - hash, var2 - salt</returns>
        public (string, string) CreateHash(string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: password,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA1,
                    iterationCount: 10000,
                    numBytesRequested: 256 / 8));
            return (hash, Convert.ToBase64String(salt));
        }
    }
}
