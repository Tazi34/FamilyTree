using Google.Apis.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Services
{
    public interface IGoogleService
    {
        public Task<string> ValidateIdToken(string idToken);
    }
    public class GoogleService : IGoogleService
    {
        public async Task<string> ValidateIdToken(string idToken)
        {
            string email;
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
                email = payload.Email;
            }
            catch (Exception)
            {
                email = null;
            }
            return email;
        }
    }
}
