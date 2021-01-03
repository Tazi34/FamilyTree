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
        public Task<TreeResponse> GetTreeAsync(int id, int userId);
        public Task<NodeResponse> GetNodeAsync(int id, int userId);
        public Task<TreeUserResponse> GetUserTreesAsync(int id, int claimId);
        public Task<TreeResponse> CreateTreeAsync(int userId, CreateTreeRequest model);
        public Task<TreeResponse> ModifyTreeAsync(int userId, ModifyTreeRequest model);
        public Task<TreeResponse> CreateNodeAsync(int userId, CreateNodeRequest model);
        public Task<TreeResponse> ModifyNodeAsync(int userId, ModifyNodeRequest model);
        public Task<TreeResponse> DeleteNodeAsync(int userId, int NodeId);
        public Task<bool> DeleteTreeAsync(int userId, int TreeId);

        public Task<TreeResponse> AddSiblingAsync(int userId, AddSiblingRequest model);
        public Task<MoveNodeResponse> MoveNodeAsync(int userId, MoveNodeRequest model);
    }
    public class TreeService : ITreeService  
    {
        private DataContext context;
        private ITreeAuthService treeAuthService;
        private ITreeValidationService treeValidationService;
        public TreeService(DataContext dataContext, ITreeAuthService treeAuthService, ITreeValidationService treeValidationService)
        {
            context = dataContext;
            this.treeAuthService = treeAuthService;
            this.treeValidationService = treeValidationService;
        }

        public async Task<TreeResponse> CreateNodeAsync(int userId, CreateNodeRequest model)
        {
            var tree = await GetTreeFromContextAsync(model.TreeId);
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;

            if (!treeValidationService.ValidateNewNode(model, tree))
                return null;

            CreateNode(tree, model);
            return new TreeResponse(tree);
        }

        public async Task<TreeResponse> AddSiblingAsync(int userId, AddSiblingRequest model)
        {
            var newNodeRequest = model.NewNode;
            var tree = await GetTreeFromContextAsync(newNodeRequest.TreeId);
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;

            if (!treeValidationService.ValidateNewNode(newNodeRequest, tree))
                return null;

       
            var sibling =await GetNodeFromContextAsync(model.SiblingId);

            //nie znaleziono rodzenstwa bad request
            if (sibling == null)
            {
                return null;
            }

            //albo wszystkie zmiany przechodza - albo zadna
            var transaction = context.Database.BeginTransaction();
            try
            {
                bool updateSibling = false;

                //nie ma rodzicow - utworz 
                if (sibling.Parents.Count == 0)
                {
                    var fakeParent = new CreateNodeRequest()
                    {
                        Birthday = DateTime.Now,
                        Name = sibling.Name + "'s",
                        Surname = "Parent",
                        Children = new List<int>() { sibling.NodeId},
                        Description = "",
                        Partners = new List<int>(),
                        Sex = "Male",
                        X = sibling.X + 100,
                        Y = sibling.Y - 450,
                        TreeId = sibling.TreeId,
                        PictureUrl = "",
                    };
                    var parent = CreateNode(tree, fakeParent);
                    newNodeRequest.FatherId = parent.NodeId;
                    sibling.FatherId = parent.NodeId;
                    updateSibling = true;
                }
                else
                {
                    newNodeRequest.FatherId = sibling.Parents[0].ParentId;
                    if(sibling.Parents.Count > 1)
                    {
                        newNodeRequest.MotherId = sibling.Parents[1].ParentId;
                    }
                }

                CreateNode(tree, newNodeRequest);
                if (updateSibling)
                {
                    context.Nodes.Update(sibling);
                    context.SaveChanges();
                }
                transaction.Commit();
            }catch(Exception ex)
            {
                return null;
            }

            return new TreeResponse(tree);
        }

        public async Task<TreeResponse> CreateTreeAsync(int userId, CreateTreeRequest model)
        {
            var user = await GetUserFromContextAsync(userId);
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
                Description = "",
                Sex = user.Sex
            };
            Tree tree = new Tree
            {
                Name = model.TreeName,
                IsPrivate = model.IsPrivate,
                Nodes = new List<Node>() { node }
            };
            context.Trees.Add(tree);
            await context.SaveChangesAsync();
            return new TreeResponse(tree);
        }

        public async Task<TreeResponse> DeleteNodeAsync(int userId, int nodeId)
        {
            var node = await GetNodeFromContextAsync(nodeId);
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;
            if (!treeValidationService.ValidateDeletedNode(node, tree))
                return null;
            if (await DeleteNodeAsync(node))
            {
                return new TreeResponse(tree);
            }
            return null;
        }

        public async Task<NodeResponse> GetNodeAsync(int nodeId, int userId)
        {
            var node = await GetNodeFromContextAsync(nodeId);
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                return null;
            return new NodeResponse(node);
        }

        public async Task<TreeResponse> GetTreeAsync(int treeId, int userId)
        {
            var tree = await GetTreeFromContextAsync(treeId);
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                return null;
            return new TreeResponse(tree);
        }

        public async Task<TreeUserResponse> GetUserTreesAsync(int userId, int askingUserId)
        {
            var askingUser = await GetUserFromContextAsync(askingUserId);
            var treeList = await GetUserTreesFromContextAsync(userId);
            var authorizedTrees = new List<FlatTree>();
            foreach(Tree tree in treeList)
            {
                var authLevel = treeAuthService.GetTreeAuthLevel(askingUser, tree);
                if (treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                    authorizedTrees.Add(new FlatTree(tree));
            }
            return new TreeUserResponse(authorizedTrees);
        }

        public async Task<TreeResponse> ModifyNodeAsync(int userId, ModifyNodeRequest model)
        {
            var node = await GetNodeFromContextAsync(model.NodeId);
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InNode, authLevel))
                return null;

            if (!treeValidationService.ValidateModifiedNode(model, tree))
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
            foreach (int child in model.Children)
            {
                var currentChild = node.Children.SingleOrDefault(c => c.ChildId == child);
                if (currentChild == null)
                {
                    var child_node = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
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
                    return null;
                }
            }
            foreach (int partner in model.Partners)
            {
                var currentPartner1 = node.Partners1.SingleOrDefault(c => c.Partner1Id == partner);
                if (currentPartner1 == null)
                {
                    var partnerNode = tree.Nodes.SingleOrDefault(n => n.NodeId == partner);
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
                    return null;
                }
            }
            node.UserId = model.UserId;
            if (!string.IsNullOrWhiteSpace(model.Sex))
                node.Sex = model.Sex;
            await context.SaveChangesAsync();
            return await GetTreeAsync(model.TreeId, userId);
        }

        public async Task<MoveNodeResponse> MoveNodeAsync(int userId, MoveNodeRequest model)
        {
            var node = await GetNodeFromContextAsync(model.NodeId);
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;

            node.X = model.X;
            node.Y = model.Y;
            context.SaveChanges();
            return new MoveNodeResponse() { NodeId = node.NodeId, X = node.X, Y = node.Y };
        }
        public async Task<TreeResponse> ModifyTreeAsync(int userId, ModifyTreeRequest model)
        {
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(model.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;
            tree.Name = model.Name;
            tree.IsPrivate = model.IsPrivate;
            context.Trees.Update(tree);
            await context.SaveChangesAsync();
            return await GetTreeAsync(model.TreeId, userId);
        }
        public async Task<bool> DeleteTreeAsync(int userId, int treeId)
        {
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(treeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return false;
            while(tree.Nodes.Count > 0)
                await DeleteNodeAsync(tree.Nodes.First());
            context.Trees.Remove(tree);
            await context.SaveChangesAsync();
            return true;
        }
        private async Task<bool> DeleteNodeAsync(Node node)
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
            await context.SaveChangesAsync();
            return true;
        }
        private Node CreateNode(Tree tree, CreateNodeRequest model)
        {
            var children = new List<NodeNode>();
            foreach (int child in model.Children)
            {
                var child_node = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
                if (child_node == null)
                    return null;
                children.Add(new NodeNode
                {
                    Child = child_node,
                    ChildId = child_node.NodeId
                });
            }
            var parents = new List<NodeNode>();
            var fatherNode = tree.Nodes.SingleOrDefault(n => n.NodeId == model.FatherId);
            if (fatherNode != null)
            {
                parents.Add(new NodeNode
                {
                    Parent = fatherNode,
                    ParentId = fatherNode.NodeId
                });
            }
            var motherNode = tree.Nodes.SingleOrDefault(n => n.NodeId == model.MotherId);
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
                var partner_node = tree.Nodes.SingleOrDefault(n => n.NodeId == partner);
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
                Description = model.Description,
                Sex = model.Sex,
                X = model.X,
                Y = model.Y
            };
            tree.Nodes.Add(node);
            context.SaveChanges();
            return node;
        }
        private async Task<Tree> GetTreeFromContextAsync(int treeId)
        {
            return await context.Trees
                .Include(x => x.Nodes).ThenInclude(x => x.Children)
                .Include(x => x.Nodes).ThenInclude(x => x.Parents)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners1)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners2)
                .FirstOrDefaultAsync(tree => tree.TreeId == treeId);
        }
        private async Task<Node> GetNodeFromContextAsync (int nodeId)
        {
            return await context.Nodes
                .Include(n => n.Children)
                .Include(n => n.Parents)
                .Include(n => n.Partners1)
                .Include(n => n.Partners2)
                .FirstOrDefaultAsync(n => n.NodeId == nodeId);
        }
        private async Task<User> GetUserFromContextAsync (int userId)
        {
            if (userId == 0) //user with no token
                return new User { UserId = 0 };
            return await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }
        private async Task<List<Tree>> GetUserTreesFromContextAsync (int userId)
        {
            return await context.Trees
                .Include(x => x.Nodes).ThenInclude(x => x.Children)
                .Include(x => x.Nodes).ThenInclude(x => x.Parents)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners1)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners2)
                .Where(tree => tree.Nodes.Any(node => node.UserId == userId)).ToListAsync();
        }

    
    }
}