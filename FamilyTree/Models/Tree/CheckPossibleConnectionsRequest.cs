using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public enum ConnectMode
    {
        AsParent, AsChild, AsPartner, ToFamily
    }
    public class CheckPossibleConnectionsRequest
    {
        [Required]
        [RegularExpression(@"AsParent|AsChild|AsPartner")]
        public string Mode { get; set; }
        [Required]
        public int NodeId { get; set; }

    }
    public class CheckPossibleConnectionResponse
    {
        public CheckPossibleConnectionResponse()
        {
            Families = new List<string>();
            Nodes = new List<int>();
        }

        public List<string> Families { get; set; }
        public List<int> Nodes { get; set; }

    }
}
