using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using FamilyTree.Helpers;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Gedcom;
using Microsoft.Extensions.Logging;

namespace FamilyTree.Services
{
    public interface IGedcomService
    {
        public Task<Stream> GetGedcom(int userId, int treeId);
    }
    public class GedcomService : IGedcomService
    {
        private ITreeAuthService treeAuthService;
        private DataContext context;
        public GedcomService(DataContext dataContext, ITreeAuthService treeAuthService)
        {
            this.treeAuthService = treeAuthService;
            this.context = dataContext;
        }
        public async Task<Stream> GetGedcom(int userId, int treeId)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            var tree = await context.Trees
                .Include(x => x.Nodes).ThenInclude(x => x.Children)
                .Include(x => x.Nodes).ThenInclude(x => x.Parents)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners1)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners2)
                .FirstOrDefaultAsync(tree => tree.TreeId == treeId);
            var authLevel = treeAuthService.GetTreeAuthLevel(user, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.PublicTree, authLevel))
                return null;
            var gedcomWriter = new GedcomWriter(tree);
            return gedcomWriter.GetGedcom();
        }
    }
}
