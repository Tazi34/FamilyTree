using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;
using FamilyTree.Helpers;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http;

namespace FamilyTree.Services
{
    public interface ITreeService
    {

        public Task<DrawableTreeResponse> GetTreeAsync(int id, int userId);
        public Task<DrawableTreeResponse> CreateNodeAsync(int userId, CreateNodeRequest model, IFormFile picture);
        public Task<DrawableTreeResponse> DeleteNodeAsync(int userId, int NodeId);
        public Task<DrawableTreeResponse> ConnectChildToParents(int userId, ConnectNodesRequest model);
        public Task<DrawableTreeResponse> AddSiblingAsync(int userId, AddSiblingRequest model);
        public Task<DrawableTreeResponse> CreateTreeAsync(int userId, CreateTreeRequest model);
        public Task<DrawableTreeResponse> ModifyTreeAsync(int userId, ModifyTreeRequest model);
        public Task<DrawableTreeResponse> ModifyNodeAsync(int userId, ModifyNodeRequest model);
        public Task<CheckPossibleConnectionResponse> CheckPossibleConnections(int userId, CheckPossibleConnectionsRequest model);
        Task<DrawableTreeResponse> ConnectPartners(int userId, ConnectPartnersRequest model);
        public Task<NodeResponse> GetNodeAsync(int id, int userId);
        public Task<TreeUserResponse> GetUserTreesAsync(int id, int claimId);
        public Task<MoveNodeResponse> MoveNodeAsync(int userId, MoveNodeRequest model);
        public Task<bool> DeleteTreeAsync(int userId, int TreeId);

    }
    public class TreeService : ITreeService
    {
        private DataContext context;
        private ITreeAuthService treeAuthService;
        private ITreeValidationService treeValidationService;
        private IPictureService pictureService;
        private string defaultNodePictureUrl;
        private string defaultUserPictureUrl;
        public TreeService(
            DataContext dataContext,
            ITreeAuthService treeAuthService,
            ITreeValidationService treeValidationService,
            IPictureService pictureService,
            IOptions<AzureBlobSettings> azureBlobSettings)
        {
            context = dataContext;
            this.treeAuthService = treeAuthService;
            this.treeValidationService = treeValidationService;
            this.pictureService = pictureService;
            defaultNodePictureUrl = azureBlobSettings.Value.DefaultNodeUrl;
            defaultUserPictureUrl = azureBlobSettings.Value.DefaultUserUrl;
        }

        public async Task<DrawableTreeResponse> CreateNodeAsync(int userId, CreateNodeRequest model, IFormFile picture)
        {
            var tree = await GetTreeFromContextAsync(model.TreeId);
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;

            if (!treeValidationService.ValidateNewNode(model, tree))
                return null;

            await CreateNode(tree, model, picture);
            return new DrawableTreeResponse(tree, user);
        }

        public async Task<DrawableTreeResponse> AddSiblingAsync(int userId, AddSiblingRequest model)
        {
            var newNodeRequest = model.NewNode;
            var tree = await GetTreeFromContextAsync(newNodeRequest.TreeId);
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;

            if (!treeValidationService.ValidateNewNode(newNodeRequest, tree))
                return null;


            var sibling = await GetNodeFromContextAsync(model.SiblingId);

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
                        Children = new List<int>() { sibling.NodeId },
                        Description = "",
                        Partners = new List<int>(),
                        Sex = "Male",
                        X = sibling.X + 100,
                        Y = sibling.Y - 450,
                        TreeId = sibling.TreeId,
                        UserId = 0
                    };
                    var parent = await CreateNode(tree, fakeParent);
                    newNodeRequest.FatherId = parent.NodeId;
                    sibling.FatherId = parent.NodeId;
                    updateSibling = true;
                }
                else
                {
                    newNodeRequest.FatherId = sibling.Parents[0].ParentId;
                    if (sibling.Parents.Count > 1)
                    {
                        newNodeRequest.MotherId = sibling.Parents[1].ParentId;
                    }
                }

                await CreateNode(tree, newNodeRequest);
                if (updateSibling)
                {
                    context.Nodes.Update(sibling);
                    context.SaveChanges();
                }
                transaction.Commit();
            }
            catch (Exception ex)
            {
                return null;
            }

            return new DrawableTreeResponse(tree, user);
        }

        public async Task<DrawableTreeResponse> CreateTreeAsync(int userId, CreateTreeRequest model)
        {
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.Everybody, authLevel))
                return null;

            string pictureUrl = defaultNodePictureUrl;
            if (user != null && user.UserId != 0)
            {
                if (user.PictureUrl != null && !user.PictureUrl.Equals("") && !user.PictureUrl.Equals(defaultUserPictureUrl))
                    pictureUrl = user.PictureUrl;
            }
            Node node = new Node
            {
                Birthday = user.Birthday,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                PictureUrl = pictureUrl,
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
            return new DrawableTreeResponse(tree, user);
        }

        public async Task<DrawableTreeResponse> DeleteNodeAsync(int userId, int nodeId)
        {
            var node = await GetNodeFromContextAsync(nodeId);
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                return null;
            if (treeValidationService.LastNotEmptyNode(node, tree))
            {
                if (await DeleteTreeAsync(userId, tree.TreeId))
                    return new DrawableTreeResponse(new Tree()
                    {
                        Nodes = new List<Node>()
                    }, user);
                else
                    return null;
            }
            else if (await DeleteNodeAsync(node))
            {
                return new DrawableTreeResponse(tree, user);
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
            bool userInTree = false;
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel))
                userInTree = true;
            return new NodeResponse(node, user, userInTree);
        }

        public async Task<DrawableTreeResponse> ConnectChildToParents(int userId, ConnectNodesRequest model)
        {
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(model.TreeId);
            var child = await GetNodeFromContextAsync(model.ChildId);
            if (child == null)
            {
                return null;
            }


            var firstParent = await GetNodeFromContextAsync(model.FirstParentId);
            if (firstParent == null)
            {
                return null;
            }
            Node secondParent = null;
            if (model.SecondParentId.HasValue)
            {
                secondParent = await GetNodeFromContextAsync(model.SecondParentId.Value);
                if (secondParent == null)
                {
                    return null;
                }
            }

            //juz ma rodzicow
            if (child.Parents.Count == 2)
            {
                var firstParentId = child.Parents[0].ParentId;
                var secondParentId = child.Parents[1].ParentId;
                if (firstParentId == model.FirstParentId && secondParentId == model.SecondParentId ||
                    firstParentId == model.SecondParentId && secondParentId == model.FirstParentId)
                {
                    //jesli rodzice sie zgadzaja - ok, po prostu zwroc drzewo
                    return new DrawableTreeResponse(tree, user);
                }

                return null;
            }
            //ma rodzica trzeba kombinowac
            if (child.Parents.Count == 1)
            {
                var firstParentId = child.Parents[0].ParentId;
                //jesli jest tylko jeden rodzic i sie zgadza to okej 
                if(secondParent == null)
                {
                    if(firstParentId == model.FirstParentId)
                    {
                        return new DrawableTreeResponse(tree, user);
                    }
                    else
                    {
                        return null;
                    }
                }

                //jesli jest dwoch i jeden sie zgadza to ok
                if (firstParentId == model.FirstParentId || firstParentId == model.SecondParentId)
                {
                    if(model.FirstParentId == firstParentId)
                    {
                        context.NodeNode.Add(new NodeNode()
                        {
                            Parent = secondParent,
                            ParentId = secondParent.NodeId,
                            Child = child,
                            ChildId = child.NodeId
                        });
                    }
                    else
                    {
                        context.NodeNode.Add(new NodeNode()
                        {
                            Parent = firstParent,
                            ParentId = firstParent.NodeId,
                            Child = child,
                            ChildId = child.NodeId
                        });                       
                    }
                    context.SaveChanges();
                    return new DrawableTreeResponse(tree, user);
                }
                else
                {
                    return null;
                }

            }
            else
            {
                //nie ma rodzicow - podepnij
                var transcation = context.Database.BeginTransaction();
                context.NodeNode.RemoveRange(child.Parents);
                context.SaveChanges();

                child.Parents.Add(new NodeNode() { Parent = firstParent, ParentId = firstParent.NodeId });
                if (secondParent != null)
                {
                    child.Parents.Add(new NodeNode() { Parent = secondParent, ParentId = secondParent.NodeId });
                }
                context.SaveChanges();
                transcation.Commit();
            }


            //var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            //if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
            //    return null;
            return new DrawableTreeResponse(tree, user);
        }
        public async Task<DrawableTreeResponse> ConnectPartners(int userId, ConnectPartnersRequest model)
        {
            var user = await GetUserFromContextAsync(userId);
            var firstPartner = await GetNodeFromContextAsync(model.FirstPartnerId);
            if (firstPartner == null)
            {
                return null;
            }
            var secondPartner = await GetNodeFromContextAsync(model.SecondPartnerId);
            if (secondPartner == null)
            {
                return null;
            }
            var tree = await GetTreeFromContextAsync(firstPartner.TreeId);

            context.NodeNodeMarriage.Add(new NodeNodeMarriage()
            {
                Partner1 = firstPartner,
                Partner2 = secondPartner
            });

            context.SaveChanges();


            //var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            //if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
            //    return null;
            return new DrawableTreeResponse(tree, user);
        }


        //public async Task<DrawableTreeResponse> ConnectNodeToFamily(int userId, ConnectNodeToFamilyRequest model)
        //{
        //    //var user = await GetUserFromContextAsync(userId);
        //    //var node = await GetNodeFromContextAsync(model.NodeId);

        //    //var tree = await GetTreeFromContextAsync(node.TreeId);
        //    //if (node == null)
        //    //{
        //    //    return null;
        //    //}
        //    //var firstParent = await GetNodeFromContextAsync(model.FirstParentId);
        //    //if (firstParent == null)
        //    //{
        //    //    return null;
        //    //}
        //    //Node secondParent = null;
        //    //if (model.SecondParentId.HasValue)
        //    //{
        //    //    //ma obu rodzicow a chcemy cos zmieniac w obu
        //    //    if (node.Parents.Any())
        //    //    {
        //    //        return null;
        //    //    }
        //    //    secondParent = await GetNodeFromContextAsync(model.SecondParentId.Value);
        //    //    if (secondParent == null)
        //    //    {
        //    //        return null;
        //    //    }
        //    //}
        //    //var transcation = context.Database.BeginTransaction();
        //    //context.NodeNode.RemoveRange(node.Parents);
        //    //context.SaveChanges();

        //    //node.Parents.Add(new NodeNode() { Parent = firstParent, ParentId = firstParent.NodeId });
        //    //if (secondParent != null)
        //    //{
        //    //    node.Parents.Add(new NodeNode() { Parent = secondParent, ParentId = secondParent.NodeId });
        //    //}
        //    //context.SaveChanges();
        //    //transcation.Commit();


        //    ////var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
        //    ////if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
        //    ////    return null;
        //    //return new DrawableTreeResponse(tree, user);
        //}

        public async Task<DrawableTreeResponse> GetTreeAsync(int treeId, int userId)
        {
            var tree = await GetTreeFromContextAsync(treeId);
            var user = await GetUserFromContextAsync(userId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                return null;
            return new DrawableTreeResponse(tree, user);
        }

        public async Task<TreeUserResponse> GetUserTreesAsync(int userId, int askingUserId)
        {
            var askingUser = await GetUserFromContextAsync(askingUserId);
            var treeList = await GetUserTreesFromContextAsync(userId);
            var authorizedTrees = new List<FlatTree>();
            foreach (Tree tree in treeList)
            {
                var authLevel = treeAuthService.GetTreeAuthLevel(askingUser, tree);
                if (treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                    authorizedTrees.Add(new FlatTree(tree));
            }
            return new TreeUserResponse(authorizedTrees);
        }

        public async Task<CheckPossibleConnectionResponse> CheckPossibleConnections(int userId, CheckPossibleConnectionsRequest model)
        {
            var user = await GetUserFromContextAsync(userId);
            var node = await GetNodeFromContextAsync(model.NodeId);
            var tree = await GetTreeFromContextAsync(node.TreeId);

            var checker = new CanConnectToChecker();
            return checker.Check(new DrawableTreeResponse(tree, user), node.NodeId, Enum.Parse<ConnectMode>(model.Mode));
        }


        public async Task<DrawableTreeResponse> ModifyNodeAsync(int userId, ModifyNodeRequest model)
        {
            var node = await GetNodeFromContextAsync(model.NodeId);
            var user = await GetUserFromContextAsync(userId);
            var tree = await GetTreeFromContextAsync(node == null ? -1 : node.TreeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree, node);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InNode, authLevel))
                return null;

            if (!treeValidationService.ValidateModifiedNode(model, tree))
                return null;

            if (model.Birthday != null)
                node.Birthday = model.Birthday;
            if (!string.IsNullOrWhiteSpace(model.Description))
                node.Description = model.Description;
            if (!string.IsNullOrWhiteSpace(model.Name))
                node.Name = model.Name;
            if (!string.IsNullOrWhiteSpace(model.Surname))
                node.Surname = model.Surname;
            foreach (int child in model.Children)
            {
                var currentChild = node.Children.SingleOrDefault(c => c.ChildId == child);
                if (currentChild == null)
                {
                    var child_node = tree.Nodes.SingleOrDefault(n => n.NodeId == child);
                    if (child_node != null)
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
        public async Task<DrawableTreeResponse> ModifyTreeAsync(int userId, ModifyTreeRequest model)
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
            while (tree.Nodes.Count > 0)
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
        private async Task<Node> CreateNode(Tree tree, CreateNodeRequest model, IFormFile picture=null)
        {
            string pictureUrl = defaultNodePictureUrl;
            var user = await GetUserFromContextAsync(model.UserId);
            if (user != null && user.UserId != 0)
            {
                if (user.PictureUrl != null && !user.PictureUrl.Equals("") && !user.PictureUrl.Equals(defaultUserPictureUrl))
                    pictureUrl = user.PictureUrl;
            }
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
                PictureUrl = pictureUrl,
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
            await context.SaveChangesAsync();
            if(picture != null)
            {
                var setPictureResponse = await pictureService.SetNodePicture(model.UserId, node.NodeId, picture);
            }
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
        private async Task<Node> GetNodeFromContextAsync(int nodeId)
        {
            return await context.Nodes
                .Include(n => n.Children)
                .Include(n => n.Parents)
                .Include(n => n.Partners1)
                .Include(n => n.Partners2)
                .FirstOrDefaultAsync(n => n.NodeId == nodeId);
        }
        private async Task<User> GetUserFromContextAsync(int userId)
        {
            if (userId == 0) //user with no token
                return new User
                {
                    UserId = 0,
                    Role = Role.User
                };
            return await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }
        private async Task<List<Tree>> GetUserTreesFromContextAsync(int userId)
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