using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;
using FamilyTree.Helpers;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Models;

namespace FamilyTree.Services
{
    public interface ITreeService
    {
        public TreeResponse GetTree(int id, int userId);
        public NodeResponse GetNode(int id, int userId);
        public TreeUserResponse GetUserTrees(int id, int claimId);
        public TreeResponse CreateTree(int userId, CreateTreeRequest model);
        public TreeResponse ModifyTree(int userId, ModifyTreeRequest model);
        public TreeResponse CreateNode(int userId, CreateNodeRequest model);
        public TreeResponse ModifyNode(int userId, ModifyNodeRequest model);
    }
    public class TreeService : ITreeService
    {
        private DataContext context;
        public TreeService(DataContext dataContext)
        {
            context = dataContext;
        }

        public TreeResponse CreateNode(int userId, CreateNodeRequest model)
        {
            var tree = context.Trees.Include(x => x.Nodes).ThenInclude(x => x.Children).SingleOrDefault(tree => tree.TreeId == model.TreeId);
            if (tree == null || !IsUserInTree(tree, userId) || !ValidateNode(model, tree))
                return null;

            var children = new List<NodeNode>();
            foreach(int child in model.Children)
            {
                var child_node = context.Nodes.SingleOrDefault(n => n.NodeId == child);
                if (child_node == null)
                    return null;
                children.Add(new NodeNode
                {
                    Child = child_node,
                    ChildId = child_node.NodeId
                });
            }
            var parents = new List<NodeNode>();
            var fatherNode = context.Nodes.SingleOrDefault(n => n.NodeId == model.FatherId);
            if(fatherNode != null)
            {
                parents.Add(new NodeNode
                {
                    Parent = fatherNode,
                    ParentId = fatherNode.NodeId
                });
            }
            var motherNode = context.Nodes.SingleOrDefault(n => n.NodeId == model.MotherId);
            if (motherNode != null)
            {
                parents.Add(new NodeNode
                {
                    Parent = motherNode,
                    ParentId = motherNode.NodeId
                });
            }
            var node = new Node
            {
                Birthday = model.Birthday,
                Name = model.Name,
                Surname = model.Surname,
                UserId = model.UserId,
                PictureUrl = model.PictureUrl,
                Children = children,
                Parents = parents,
                FatherId = model.FatherId,
                MotherId = model.MotherId,
                Description = model.Description
            };
            tree.Nodes.Add(node);
            context.SaveChanges();
            return GetTree(model.TreeId, userId);
        }

        public TreeResponse CreateTree(int userId, CreateTreeRequest model)
        {
            var user = context.Users.SingleOrDefault(user => user.UserId == userId);
            if (user == null)
                return null;
            Node node = new Node
            {
                Birthday = user.Birthday,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                PictureUrl = user.PictureUrl,
                Children = new List<NodeNode>(),
                Parents = new List<NodeNode>(),
                FatherId = 0,
                MotherId = 0,
                Description = ""
            };
            Tree tree = new Tree
            {
                Name = model.TreeName,
                IsPrivate = model.IsPrivate,
                Nodes = new List<Node>() { node }
            };
            context.Trees.Add(tree);
            context.SaveChanges();
            return GetTree(tree.TreeId, user.UserId);
        }

        public NodeResponse GetNode(int id, int userId)
        {
            var node = context.Nodes.Include(x => x.Children).SingleOrDefault(node => node.NodeId == id);
            if (node == null)
                return null;
            var tree = context.Trees.Include(x => x.Nodes).ThenInclude(x => x.Children).SingleOrDefault(tree => tree.TreeId == node.TreeId);
            if (tree != null && (!tree.IsPrivate || IsUserInTree(tree, userId)))
            {
                return new NodeResponse(node);
            }
            return null;
        }

        public TreeResponse GetTree(int id, int userId)
        {
            var tree = context.Trees.Include(x => x.Nodes).ThenInclude(x => x.Children).SingleOrDefault(tree => tree.TreeId == id);
            if(tree != null && (!tree.IsPrivate || IsUserInTree(tree, userId)))
            {
                return new TreeResponse(tree);
            }
            return null;
        }

        public TreeUserResponse GetUserTrees(int id, int claimId)
        {
            var trees = context.Trees.Include(x => x.Nodes).Where(tree => tree.Nodes.Any(node => node.UserId == id));
            if (trees == null)
                return null;
            var authorizedTrees = new List<FlatTree>();
            foreach(Tree tree in trees)
            {
                if (!tree.IsPrivate || IsUserInTree(tree, claimId))
                    authorizedTrees.Add(new FlatTree(tree));
            }
            return new TreeUserResponse
            {
                Trees = authorizedTrees
            };
        }

        public bool IsUserInTree(Tree tree, int userId)
        {
            foreach(Node node in tree.Nodes)
            {
                if (node.UserId == userId)
                    return true;
            }
            return false;
        }

        public TreeResponse ModifyNode(int userId, ModifyNodeRequest model)
        {
            var tree = context.Trees.Include(x => x.Nodes).ThenInclude(x => x.Children).SingleOrDefault(tree => tree.TreeId == model.TreeId);
            if (tree == null || !IsUserInTree(tree, userId) || !ValidateNode(model, tree))
                return null;
            var node = tree.Nodes.SingleOrDefault(n => n.NodeId == model.NodeId);
            if (node == null)
                return null;
            if(model.Birthday != null)
                node.Birthday = model.Birthday;
            if (!string.IsNullOrWhiteSpace(model.Description))
                node.Description = model.Description;
            if (!string.IsNullOrWhiteSpace(model.Name))
                node.Name = model.Name;
            if (!string.IsNullOrWhiteSpace(model.Surname))
                node.Surname = model.Surname;
            if (!string.IsNullOrWhiteSpace(model.PictureUrl))
                node.PictureUrl = model.PictureUrl;
            if (model.Children != null)
            {
                foreach (int child in model.Children)
                {
                    var currentChild = node.Children.SingleOrDefault(c => c.ChildId == child);
                    if (currentChild == null)
                    {
                        var child_node = context.Nodes.SingleOrDefault(n => n.NodeId == child);
                        if(child_node != null)
                        {
                            var rel = new NodeNode
                            {
                                ChildId = child_node.NodeId,
                                Child = child_node,
                                ParentId = node.NodeId,
                                Parent = node
                            };
                            context.NodeNode.Add(rel);
                        }
                    }
                }
            }
            node.MotherId = model.MotherId;
            node.FatherId = model.FatherId;
            node.UserId = model.UserId;
            context.SaveChanges();
            return GetTree(model.TreeId, userId);
        }

        public TreeResponse ModifyTree(int userId, ModifyTreeRequest model)
        {
            var tree = context.Trees.Include(x => x.Nodes).SingleOrDefault(tree => tree.TreeId == model.TreeId);
            if (!IsUserInTree(tree, userId))
                return null;
            tree.Name = model.Name;
            tree.IsPrivate = model.IsPrivate;
            context.Trees.Update(tree);
            context.SaveChanges();
            return GetTree(model.TreeId, userId);
        }
        private bool ValidateNode(CreateNodeRequest node, Tree tree)
        {
            if (node.FatherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == node.FatherId) == null)
                return false;
            if (node.MotherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == node.MotherId) == null)
                return false;
            foreach(int child in node.Children)
            {
                if (tree.Nodes.SingleOrDefault(n => n.NodeId == child) == null)
                    return false;
            }
            return true;
        }
        private bool ValidateNode(ModifyNodeRequest node, Tree tree)
        {
            if (node.FatherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == node.FatherId) == null)
                return false;
            if (node.MotherId != 0 && tree.Nodes.SingleOrDefault(n => n.NodeId == node.MotherId) == null)
                return false;
            foreach (int child in node.Children)
            {
                if (tree.Nodes.SingleOrDefault(n => n.NodeId == child) == null)
                    return false;
            }
            return true;
        }
    }
}
