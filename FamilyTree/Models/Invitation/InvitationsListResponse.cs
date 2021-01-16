using System.Collections.Generic;

namespace FamilyTree.Models
{
    public class InvitationsListResponse
    {
        public List<InvitationResponse> Invitations {get; set;}
    }
    public class InvitationResponse
    {
        public int InvitationId { get; set; }
        public int HostId { get; set; }
        public string HostName { get; set; }
        public string HostSurname { get; set; }
        public string HostPictureUrl { get; set; }
        public string TreeName { get; set; }
        public int TreeId { get; set; }
        public bool IsPrivate { get; set; }
    }
}
