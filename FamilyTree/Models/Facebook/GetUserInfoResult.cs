﻿using System;
using Newtonsoft.Json;

namespace FamilyTree.Models
{
        public class FacebookUserInfoResult
    {
            [JsonProperty("first_name")]
            public string FirstName { get; set; }

            [JsonProperty("last_name")]
            public string LastName { get; set; }

            [JsonProperty("email")]
            public string Email { get; set; }

            [JsonProperty("picture")]
            public FacebookPicture Picture { get; set; }

            [JsonProperty("id")]
            public string Id { get; set; }
        }

        public class FacebookPicture
        {
            [JsonProperty("data")]
            public FacebookPictureDetails Details { get; set; }
        }

        public class FacebookPictureDetails
    {
            [JsonProperty("height")]
            public long Height { get; set; }

            [JsonProperty("is_silhouette")]
            public bool IsSilhouette { get; set; }

            [JsonProperty("url")]
            public Uri Url { get; set; }

            [JsonProperty("width")]
            public long Width { get; set; }
        }
}
