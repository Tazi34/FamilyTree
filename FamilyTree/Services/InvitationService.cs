using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using FamilyTree.Models;
using FamilyTree.Helpers;
using FamilyTree.Entities;

namespace FamilyTree.Services
{
    public interface IInvitationService
    {
        public Task<bool> CreateInvitationAsync(CreateInvitationRequest model);
        public Task<TreeResponse> AcceptInvitationAsync(AcceptRefuseInvitationRequest model);
        public Task<bool> RefuseInvitationAsync(AcceptRefuseInvitationRequest model);
        public Task<InvitationsListResponse> GetInvitationsAsync(int userId);
    }
    public class InvitationService:IInvitationService
    {
        private DataContext context;
        private ITreeAuthService treeAuthService;
        private ITreeService treeService;
        public InvitationService(DataContext dataContext, ITreeAuthService treeAuthService, ITreeService treeService)
        {
            context = dataContext;
            this.treeAuthService = treeAuthService;
            this.treeService = treeService;
        }

        public async Task<TreeResponse> AcceptInvitationAsync(AcceptRefuseInvitationRequest model)
        {
            var invitation = await context.Invitations
                .Include(i => i.AskedUser)
                .FirstOrDefaultAsync(i => i.InvitationId == model.InvitationId && i.AskedUserId == model.UserId);
            if (invitation == null)
                return null;
            var createNodeRequest = new CreateNodeRequest
            {
                Name = invitation.AskedUser.Name,
                Surname = invitation.AskedUser.Surname,
                Sex = invitation.AskedUser.Sex,
                Birthday = invitation.AskedUser.Birthday,
                UserId = invitation.AskedUserId,
                TreeId = invitation.TreeId,
                Children = new List<int>(),
                FatherId = 0,
                MotherId = 0,
                Partners = new List<int>()
            };
            var createNodeResponse = await treeService.CreateNodeAsync(invitation.HostId, createNodeRequest, null);
            if (createNodeRequest == null)
                return null;
            var treeRequest = await treeService.GetTreeAsync(invitation.TreeId, model.UserId);
            if (treeRequest == null)
                return null;
            context.Invitations.Remove(invitation);
            await context.SaveChangesAsync();
            return treeRequest;
        }

        public async Task<bool> CreateInvitationAsync(CreateInvitationRequest model)
        {
            var tree = await context.Trees
                .Include(x => x.Nodes).ThenInclude(x => x.Children)
                .Include(x => x.Nodes).ThenInclude(x => x.Parents)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners1)
                .Include(x => x.Nodes).ThenInclude(x => x.Partners2)
                .FirstOrDefaultAsync(tree => tree.TreeId == model.TreeId);
            var hostUser = await context.Users.FirstOrDefaultAsync(u => u.UserId == model.HostUserId);
            var askedUser = await context.Users.FirstOrDefaultAsync(u => u.UserId == model.AskedUserId);
            var authLevel = treeAuthService.GetTreeAuthLevel(hostUser, tree);
            if (!treeAuthService.IsAuthLevelSuficient(TreeAuthLevel.InTree, authLevel) || askedUser == null)
                return false;
            var alreadyCreatedInvitation = await context.Invitations
                .FirstOrDefaultAsync(i => i.AskedUserId == model.AskedUserId && i.TreeId == model.TreeId);
            var alreadyInTree = treeAuthService.GetTreeAuthLevel(askedUser, tree);
            if (alreadyCreatedInvitation != null || alreadyInTree == TreeAuthLevel.InTree)
                return true;
            var invitation = new Invitation
            {
                AskedUserId = model.AskedUserId,
                HostId = model.HostUserId,
                TreeId = model.TreeId
            };
            context.Invitations.Add(invitation);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<InvitationsListResponse> GetInvitationsAsync(int userId)
        {
            var invitations = await context.Invitations
                .Include(i => i.Host)
                .Include(i => i.Tree)
                .Where(i => i.AskedUserId == userId)
                .ToListAsync();
            if (invitations == null)
                return null;
            var response = new InvitationsListResponse
            {
                Invitations = new List<InvitationResponse>()
            };
            foreach(Invitation i in invitations)
            {
                response.Invitations.Add(new InvitationResponse
                {
                    InvitationId = i.InvitationId,
                    HostId = i.HostId,
                    HostName = i.Host.Name,
                    HostSurname = i.Host.Surname,
                    HostPictureUrl = i.Host.PictureUrl,
                    TreeId = i.TreeId,
                    IsPrivate = i.Tree.IsPrivate,
                    TreeName = i.Tree.Name
                });
            }
            return response;
        }

        public async Task<bool> RefuseInvitationAsync(AcceptRefuseInvitationRequest model)
        {
            var invitation = await context.Invitations
                .FirstOrDefaultAsync(i => i.InvitationId == model.InvitationId && i.AskedUserId == model.UserId);
            if (invitation == null)
                return false;
            context.Invitations.Remove(invitation);
            await context.SaveChangesAsync();
            return true;
        }
    }
}
