using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Models;
using FamilyTree.Helpers;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Entities;

namespace FamilyTree.Services
{
    public interface ICommentService
    {
        public Task<CommentsListResponse> GetCommentsList(int postid);
        public Task<CommentsListResponse> CreateComment(int userId, CreateCommentRequest model);
        public Task<CommentsListResponse> DeleteComment(int userId, int commetId);
        public Task<CommentsListResponse> ModifyComment(int userId, ModifyCommentRequest model);
    }
    public class CommentService : ICommentService
    {
        private DataContext context;
        public CommentService(DataContext dataContext)
        {
            context = dataContext;
        }

        public async Task<CommentsListResponse> CreateComment(int userId, CreateCommentRequest model)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            var post = await context.Posts.FirstOrDefaultAsync(u => u.PostId == model.PostId);
            if (post == null)
                return null;
            var comment = new Comment
            {
                Post = post,
                User = user,
                Text = model.Text,
                Time = DateTime.Now
            };
            context.Comments.Add(comment);
            await context.SaveChangesAsync();
            return await GetCommentsList(post.PostId);
        }

        public async Task<CommentsListResponse> DeleteComment(int userId, int commetId)
        {
            var comment = await context.Comments
                .Include(c => c.User)
                .Include(c => c.Post)
                .FirstOrDefaultAsync(c => c.CommentId == commetId);
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (comment == null || (comment.User.UserId != userId && !user.Role.Equals(Role.Admin)))
                return null;
            context.Comments.Remove(comment);
            await context.SaveChangesAsync();
            return await GetCommentsList(comment.Post.PostId);
        }

        public async Task<CommentsListResponse> GetCommentsList(int postid)
        {
            var commentList = await context.Comments
                .Include(c => c.Post)
                .Include(c => c.User)
                .Where(c => c.Post.PostId == postid)
                .OrderByDescending(c => c.Time)
                .ToListAsync();
            if (commentList == null)
                return null;
            var result = new CommentsListResponse
            {
                PostId = postid,
                Comments = new List<CommentResponse>()
            };
            foreach(Comment c in commentList)
            {
                result.Comments.Add(new CommentResponse
                {
                    CommentId = c.CommentId,
                    Text = c.Text,
                    Time = c.Time,
                    User = new UserInfoResponse
                    {
                        Name = c.User.Name,
                        Surname = c.User.Surname,
                        UserId = c.User.UserId,
                        PictureUrl = c.User.PictureUrl
                    }
                });
            }
            return result;
        }

        public async Task<CommentsListResponse> ModifyComment(int userId, ModifyCommentRequest model)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            var comment = await context.Comments
                .Include(c => c.User)
                .Include(c => c.Post)
                .FirstOrDefaultAsync(c => c.CommentId == model.CommentId);
            if (comment == null || (comment.User.UserId != userId && !user.Role.Equals(Role.Admin)))
                return null;
            comment.Text = model.Text;
            context.Comments.Update(comment);
            await context.SaveChangesAsync();
            return await GetCommentsList(comment.Post.PostId);
        }
    }
}
