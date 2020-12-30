using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class SearchResponse
    {
        public List<TreeSearchResponse> Trees { get; set; }
        public List<UserSearchResponse> Users { get; set; }
    }
}
