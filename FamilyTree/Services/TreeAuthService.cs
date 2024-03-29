﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;
using FamilyTree.Helpers;

namespace FamilyTree.Services
{
    public interface ITreeAuthService
    {
        public TreeAuthLevel GetTreeAuthLevel (User user);
        public TreeAuthLevel GetTreeAuthLevel (User user, Tree tree);
        public TreeAuthLevel GetTreeAuthLevel (User user, Tree tree, Node node);
        public bool IsAuthLevelSuficient(TreeAuthLevel demendedLevel, TreeAuthLevel userLevel);
    }
    public class TreeAuthService : ITreeAuthService
    {
        public TreeAuthLevel GetTreeAuthLevel(User user, Tree tree)
        {
            if (user == null || tree == null)
                return TreeAuthLevel.Error;
            if (user.Role.Equals(Role.Admin))
                return TreeAuthLevel.Admin;
            if (IsUserInTree(tree, user) && user.UserId != 0)
                return TreeAuthLevel.InTree;
            if (!tree.IsPrivate)
                return TreeAuthLevel.PublicTree;
            return TreeAuthLevel.Everybody;
        }

        public TreeAuthLevel GetTreeAuthLevel(User user, Tree tree, Node node)
        {
            if (user == null || tree == null || node == null)
                return TreeAuthLevel.Error;
            if (user.Role.Equals(Role.Admin))
                return TreeAuthLevel.Admin;
            if (user.UserId != 0 && (node.UserId == user.UserId || (node.UserId == 0 && IsUserInTree(tree, user))))
                return TreeAuthLevel.InNode;
            if (IsUserInTree(tree, user) && user.UserId != 0)
                return TreeAuthLevel.InTree;
            if (!tree.IsPrivate)
                return TreeAuthLevel.PublicTree;
            return TreeAuthLevel.Everybody;
        }

        public TreeAuthLevel GetTreeAuthLevel(User user)
        {
            if (user == null)
                return TreeAuthLevel.Error;
            if (user.Role.Equals(Role.Admin))
                return TreeAuthLevel.Admin;
            return TreeAuthLevel.Everybody;
        }

        public bool IsAuthLevelSuficient(TreeAuthLevel demendedLevel, TreeAuthLevel userLevel)
        {
            if ((int)demendedLevel <= (int)userLevel)
                return true;
            return false;
        }

        public bool IsUserInTree(Tree tree, User user)
        {
            foreach (Node node in tree.Nodes)
            {
                if (node.UserId == user.UserId)
                    return true;
            }
            return false;
        }
    }
}
