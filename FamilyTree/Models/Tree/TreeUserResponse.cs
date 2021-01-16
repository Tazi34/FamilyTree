using System.Collections.Generic;

namespace FamilyTree.Models
{
    public class TreeUserResponse
    {
        public List<FlatTree> Trees { get; set; }
        public TreeUserResponse(List<FlatTree> treeList)
        {
            Trees = treeList;
        }
    }
}
