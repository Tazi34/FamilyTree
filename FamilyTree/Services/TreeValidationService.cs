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
        public bool LastNotEmptyNode(Node node, Tree tree);
    }
    public class TreeValidationService : ITreeValidationService
    {
        public bool LastNotEmptyNode(Node node, Tree tree)
        {
            if (node.UserId == 0)
                return false;
            foreach(var n in tree.Nodes)
            {
                if (n.UserId != 0 && n.NodeId != node.NodeId)
                    return false;
            }
            return true;
        }

        public bool ValidateModifiedNode(ModifyNodeRequest model, Tree tree)
        {
            if(model.FatherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == model.FatherId) == null)
                return false;
            if (model.MotherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == model.MotherId) == null)
                return false;
            foreach (int child in model.Children)
            {
                var childNode = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
                if (childNode == null)
                    return false;
                if (childNode.Parents.Count > 1 && childNode.Parents[0].ParentId != model.NodeId && childNode.Parents[1].ParentId != model.NodeId)
                    return false;
            }
            foreach (int partner in model.Partners)
            {
                var partnerNode = tree.Nodes.SingleOrDefault(n => n.NodeId == partner);
                if (partnerNode == null)
                    return false;
            }
            return true;
        }

        public bool ValidateNewNode(CreateNodeRequest model, Tree tree)
        {
            if (model.FatherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == model.FatherId) == null)
                return false;
            if (model.MotherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == model.MotherId) == null)
                return false;
            foreach (int child in model.Children)
            {
                var childNode = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
                if (childNode == null)
                    return false;
                if (childNode.Parents.Count > 1)
                    return false;
            }
            foreach (int partner in model.Partners)
            {
                var partnerNode = tree.Nodes.SingleOrDefault(n => n.NodeId == partner);
                if (partnerNode == null)
                    return false;
            }
            return true;
        }
    }
}
