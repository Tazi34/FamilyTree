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
        public NodeResponse CreateNode(int userId, CreateNodeRequest model);
        public TreeResponse ModifyNode(int userId, ModifyNodeRequest model);
        public bool DeleteNode(int userId, int NodeId);
        public bool DeleteTree(int userId, int TreeId);
    }
    public class TreeService : ITreeService
    {
        private DataContext context;
        private ITreeAuthService treeAuthService;
        public TreeService(DataContext dataContext, ITreeAuthService treeAuthService)
        {
            context = dataContext;
            this.treeAuthService = treeAuthService;
        }

        public NodeResponse CreateNode(int userId, CreateNodeRequest model)
        {
            var tree = GetTreeFromContext(model.TreeId);
            var user = GetUserFromContext(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;

            if (!ValidateNode(model, tree))
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
            var partners1 = new List<NodeNodeMarriage>();
            var partners2 = new List<NodeNodeMarriage>();
            foreach (int partner in model.Partners)
            {
                var partner_node = context.Nodes.SingleOrDefault(n => n.NodeId == partner);
                if (partner_node == null)
                    return null;
                partners1.Add(new NodeNodeMarriage
                {
                    Partner1 = partner_node,
                    Partner1Id = partner_node.NodeId
                });
                partners2.Add(new NodeNodeMarriage
                {
                    Partner2 = partner_node,
                    Partner2Id = partner_node.NodeId
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
                Partners1 = partners1,
                Partners2 = partners2,
                FatherId = model.FatherId,
                MotherId = model.MotherId,
                Description = model.Description
            };
            tree.Nodes.Add(node);
            context.SaveChanges();
            return new NodeResponse(node);
        }

        public TreeResponse CreateTree(int userId, CreateTreeRequest model)
        {
            var user = GetUserFromContext(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.Everybody, authLevel))
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
                Partners1 = new List<NodeNodeMarriage>(),
                Partners2 = new List<NodeNodeMarriage>(),
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

        public bool DeleteNode(int userId, int nodeId)
        {
            var node = GetNodeFromContext(nodeId);
            var user = GetUserFromContext(userId);
            var tree = GetTreeFromContext(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return false;
            return DeleteNode(node);
        }
        private bool DeleteNode(Node node)
        {
            if (node.Parents.Count > 0)
            {
                var parentsNodeNodes = node.Parents.Where(nn => nn.ChildId == node.NodeId);
                foreach (var nodeNode in parentsNodeNodes)
                    context.NodeNode.Remove(nodeNode);
            }
            if (node.Partners1.Count > 0)
            {
                var partnersNodeNodes = node.Partners1.Where(nnm => nnm.Partner2Id == node.NodeId);
                foreach (var nodeNode in partnersNodeNodes)
                    context.NodeNodeMarriage.Remove(nodeNode);
            }
            context.Nodes.Remove(node);
            context.SaveChanges();
            return true;
        }

        public NodeResponse GetNode(int nodeId, int userId)
        {
            var node = GetNodeFromContext(nodeId);
            var user = GetUserFromContext(userId);
            var tree = GetTreeFromContext(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                return null;
            return new NodeResponse(node);
        }

        public TreeResponse GetTree(int treeId, int userId)
        {
            var user = GetUserFromContext(userId);
            var tree = GetTreeFromContext(treeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                return null;
            return new TreeResponse(tree);
        }

        public TreeUserResponse GetUserTrees(int userId, int askingUserId)
        {
            var askingUser = GetUserFromContext(askingUserId);
            var treeList = GetUserTreesFromContext(userId);
            var authorizedTrees = new List<FlatTree>();
            foreach(Tree tree in treeList)
            {
                var authLevel = treeAuthService.GetTreeAuthLevel(askingUser, tree);
                if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                    authorizedTrees.Add(new FlatTree(tree));
            }
            return new TreeUserResponse(authorizedTrees);
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
            var node = GetNodeFromContext(model.NodeId);
            var user = GetUserFromContext(userId);
            var tree = GetTreeFromContext(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InNode, authLevel))
                return null;

            if (!ValidateNode(model, tree))
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
            if(model.Partners != null)
            {
                foreach (int partner in model.Partners)
                {
                    var currentPartner1 = node.Partners1.SingleOrDefault(c => c.Partner1Id == partner);
                    if (currentPartner1 == null)
                    {
                        var partnerNode = context.Nodes.SingleOrDefault(n => n.NodeId == partner);
                        if (partnerNode != null)
                        {
                            var rel1 = new NodeNodeMarriage
                            {
                                Partner1 = partnerNode,
                                Partner1Id = partnerNode.NodeId,
                                Partner2 = node,
                                Partner2Id = node.NodeId,
                            };
                            var rel2 = new NodeNodeMarriage
                            {
                                Partner2 = partnerNode,
                                Partner2Id = partnerNode.NodeId,
                                Partner1 = node,
                                Partner1Id = node.NodeId,
                            };
                            context.NodeNodeMarriage.Add(rel1);
                            context.NodeNodeMarriage.Add(rel2);
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
            var user = GetUserFromContext(userId);
            var tree = GetTreeFromContext(model.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
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
                var childNode = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
                if (childNode == null)
                    return false;
                if (childNode.Parents.Count > 1)
                    return false;
            }
            foreach(int partner in node.Partners)
            {
                var partnerNode = tree.Nodes.SingleOrDefault(n => n.NodeId == partner);
                if (partnerNode == null)
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
                var childNode = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
                if (childNode == null)
                    return false;
                if (childNode.Parents.Count > 1 && childNode.Parents[0].ParentId != node.NodeId && childNode.Parents[1].ParentId != node.NodeId)
                    return false;
            }
            foreach (int partner in node.Partners)
            {
                var partnerNode = tree.Nodes.SingleOrDefault(n => n.NodeId == partner);
                if (partnerNode == null)
                    return false;
            }
            return true;
        }

        public bool DeleteTree(int userId, int treeId)
        {
            var user = GetUserFromContext(userId);
            var tree = GetTreeFromContext(treeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return false;
            while(tree.Nodes.Count > 0)
                DeleteNode(tree.Nodes.First());
            context.Trees.Remove(tree);
            context.SaveChanges();
            return true;
        }
        private Tree GetTreeFromContext (int treeId)
        {
            return context.Trees
                .Include(x => x.Nodes).ThenInclude(x => x.Children)
                .Include(x => x.Nodes).ThenInclude(x => x.Parents)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners1)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners2)
                .SingleOrDefault(tree => tree.TreeId == treeId);
        }
        private Node GetNodeFromContext (int nodeId)
        {
            return context.Nodes
                .Include(n => n.Children)
                .Include(n => n.Parents)
                .Include(n => n.Partners1)
                .Include(n => n.Partners2)
                .SingleOrDefault(n => n.NodeId == nodeId);
        }
        private User GetUserFromContext (int userId)
        {
            if (userId == 0)//user with no token
                return new User { UserId = 0 };
            return context.Users.SingleOrDefault(u => u.UserId == userId);
        }
        private List<Tree> GetUserTreesFromContext (int userId)
        {
            return context.Trees
                .Include(x => x.Nodes).ThenInclude(x => x.Children)
                .Include(x => x.Nodes).ThenInclude(x => x.Parents)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners1)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners2)
                .Where(tree => tree.Nodes.Any(node => node.UserId == userId)).ToList();
        }
    }
}