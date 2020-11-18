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
    }
    public class TreeService : ITreeService
    {
        private DataContext _context;
        public TreeService(DataContext data_context)
        {
            _context = data_context;
        }

        public TreeResponse CreateTree(int userId, CreateTreeRequest model)
        {
            var user = _context.Users.SingleOrDefault(user => user.UserId == userId);
            if (user == null)
                return null;
            Node node = new Node
            {
                Birthday = user.Birthday,
                Name = user.Name,
                Surname = user.Surname,
                UserId = user.UserId,
                PictureUrl = user.PictureUrl,
                Children = new List<Child>(),
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
            _context.Trees.Add(tree);
            _context.SaveChanges();
            return GetTree(tree.TreeId, user.UserId);
        }

        public NodeResponse GetNode(int id, int userId)
        {
            var node = _context.Nodes.Include(x => x.Children).SingleOrDefault(node => node.NodeId == id);
            if (node == null)
                return null;
            var tree = _context.Trees.Include(x => x.Nodes).ThenInclude(x => x.Children).SingleOrDefault(tree => tree.TreeId == node.TreeId);
            if (tree != null && (!tree.IsPrivate || IsUserInTree(tree, userId)))
            {
                return new NodeResponse(node);
            }
            return null;
        }

        public TreeResponse GetTree(int id, int userId)
        {
            var tree = _context.Trees.Include(x => x.Nodes).ThenInclude(x => x.Children).SingleOrDefault(tree => tree.TreeId == id);
            if(tree != null && (!tree.IsPrivate || IsUserInTree(tree, userId)))
            {
                return new TreeResponse(tree);
            }
            return null;
        }

        public TreeUserResponse GetUserTrees(int id, int claimId)
        {
            var trees = _context.Trees.Include(x => x.Nodes).Where(tree => tree.Nodes.Any(node => node.UserId == id));
            if (trees == null)
                return null;
            var valid_trees = new List<FlatTree>();
            foreach(Tree tree in trees)
            {
                if (!tree.IsPrivate || IsUserInTree(tree, claimId))
                    valid_trees.Add(new FlatTree(tree));
            }
            return new TreeUserResponse
            {
                Trees = valid_trees
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
    }
}
