using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Entities
{
    public class PreviousSurname
    {
        public int PreviousSurnameId { get; set; }
        public int UserId { get; set; }
        public string Surname { get; set; }
    }
}
