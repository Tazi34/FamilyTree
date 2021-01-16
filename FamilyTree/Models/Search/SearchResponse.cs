using System.Collections.Generic;

namespace FamilyTree.Models
{
    public class SearchResponse
    {
        public List<TreeSearchResponse> Trees { get; set; }
        public List<UserSearchResponse> Users { get; set; }
    }
}
