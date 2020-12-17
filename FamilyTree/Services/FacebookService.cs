using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FamilyTree.Helpers;
using Newtonsoft.Json;
using FamilyTree.Models;
using Microsoft.Extensions.Configuration;

namespace FamilyTree.Services
{
    public interface IFacebookService
    {
        public Task<FacebookUserInfoResult> GetUserInfo(string accessToken);
    }
    public class FacebookService : IFacebookService
    {
        private IHttpClientFactory clientFactory;
        private FacebookSettings facebookSettings;
        private string validateURL = "https://graph.facebook.com/debug_token?input_token={0}&access_token={1}|{2}";
        private string userInfoURL = "https://graph.facebook.com/me/?fields=first_name,last_name,birthday,email,picture&access_token={0}";
        public FacebookService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            this.facebookSettings = configuration.GetSection("FacebookSettings").Get<FacebookSettings>();
            clientFactory = httpClientFactory;
        }

        public async Task<FacebookUserInfoResult> GetUserInfo(string accessToken)
        {
            if (!(await Validate(accessToken)))
                return null;
            return await GetUserInfoFromFacebookApi(accessToken);
        }
        private async Task<bool> Validate(string accessToken)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, string.Format(validateURL, accessToken, facebookSettings.AppId, facebookSettings.Secret));
            var client = clientFactory.CreateClient();
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
                return true;
            return false;
        }
        private async Task<FacebookUserInfoResult> GetUserInfoFromFacebookApi(string accessToken)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, string.Format(userInfoURL, accessToken));
            var client = clientFactory.CreateClient();
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string responseAsString = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<FacebookUserInfoResult>(responseAsString);
            }
            return null;
        }
    }
}
