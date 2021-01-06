using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace FamilyTree.Services
{
    public interface IGedcomService
    {
        public Task<Stream> GetGedcom(int userId, int treeId);
    }
    public class GedcomService : IGedcomService
    {
        public Task<Stream> GetGedcom(int userId, int treeId)
        {
            throw new NotImplementedException();
        }
    }
}
