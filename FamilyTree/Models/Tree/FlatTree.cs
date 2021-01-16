using FamilyTree.Entities;

namespace FamilyTree.Models
{
    public class FlatTree
    {
        public int TreeId { get; set; }
        public string Name { get; set; }
        public bool IsPrivate { get; set; }
        public FlatTree(Tree tree)
        {
            TreeId = tree.TreeId;
            Name = tree.Name;
            IsPrivate = tree.IsPrivate;
        }
    }
}
