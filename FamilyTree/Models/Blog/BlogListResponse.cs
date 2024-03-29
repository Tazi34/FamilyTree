﻿using System;
using System.Collections.Generic;

namespace FamilyTree.Models
{
    public class BlogListResponse
    {
        public BlogUserProfileResponse User { get; set; }
        public List<PostResponse> Posts { get; set; }
    }

    public class BlogUserProfileResponse
    {
        public int UserId { get; set; }
        public string Name {get;set;}
        public string Surname {get;set;}
        public string MaidenName { get; set; }
        public string PictureUrl {get;set;}
        public DateTime Birthday { get; set; }
    }
}
