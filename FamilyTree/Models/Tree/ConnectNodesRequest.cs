using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ConnectNodesRequest
    {
        [Required]
        public int TreeId { get; set; }
        public int ChildId { get; set; }
        public int FirstParentId {get; set;}
        public int? SecondParentId {get; set;}
    }
}
