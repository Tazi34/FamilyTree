using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class CreatePostRequest
    {
        public string Title { get; set; }
        public string Text { get; set; }
        public string PictureUrl { get; set; }
    }
}
