using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Models;
using FamilyTree.Entities;

namespace FamilyTree.Services
{
    public interface ITreeValidationService
    {
        public bool ValidateNewNode(CreateNodeRequest model, Tree tree);
        public bool ValidateModifiedNode(ModifyNodeRequest model, Tree tree);
    }
    public class TreeValidationService : ITreeValidationService
    {
        public bool ValidateModifiedNode(ModifyNodeRequest model, Tree tree)
        {
            throw new NotImplementedException();
        }

        public bool ValidateNewNode(CreateNodeRequest model, Tree tree)
        {
            throw new NotImplementedException();
        }
    }
}
