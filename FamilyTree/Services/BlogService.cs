using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Models;
using FamilyTree.Helpers;
using FamilyTree.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTree.Services
{
    public interface IBlogService
    {
        public Task<BlogListResponse> GetPostsListAsync(int userId);
        public Task<PostResponse> GetPostAsync(int postId);
        public Task<PostResponse> CreatePostAsync(int userId, CreatePostRequest model);
        public Task<PostResponse> ModifyPostAsync(int userId, ModifyPostRequest model);
        public Task<bool> DeletePostAsync(int userId, int postId);
    }
    public class BlogService : IBlogService
    {
        private DataContext context;
        public BlogService(DataContext dataContext)
        {
            context = dataContext;
        }

        public async Task<PostResponse> CreatePostAsync(int userId, CreatePostRequest model)
        {
            var user = await context.Users.FirstOrDefaultAsync(user => user.UserId == userId);
            if (user == null)
                return null;
            var newPost = new Post
            {
                CreationTime = DateTime.Now,
                PictureUrl = model.PictureUrl,
                Text = model.Text,
                Title = model.Title,
                UserId = userId
            };
            context.Posts.Add(newPost);
            await context.SaveChangesAsync();
            return CreateResponse(newPost, user);
        }

        public async Task<bool> DeletePostAsync(int userId, int postId)
        {
            var post = await context.Posts.FirstOrDefaultAsync(post => post.PostId == postId);
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (post == null || (post.UserId != userId && !user.Role.Equals(Role.Admin)))
                return false;
            context.Posts.Remove(post);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<PostResponse> GetPostAsync(int postId)
        {
            var post = await context.Posts
                .Include(p => p.User)
                .FirstOrDefaultAsync(post => post.PostId == postId);
            if (post == null)
                return null;
            return CreateResponse(post, post.User);
        }

        public async Task<BlogListResponse> GetPostsListAsync(int userId)
        {
            var postsList = await context.Posts.Where(post => post.UserId == userId).ToListAsync();
            var user = await context.Users.FirstOrDefaultAsync(user => user.UserId == userId);
            if (user == null)
                return null;
            var response = new BlogListResponse
            {
                User = new BlogUserProfileResponse
                {
                    UserId = user.UserId,
                    Name = user.Name,
                    Surname = user.Surname,
                    MaidenName = user.MaidenName,
                    PictureUrl =user.PictureUrl,
                    Birthday = user.Birthday,
                },
                Posts = new List<PostResponse>()
            };
            foreach(Post p in postsList)
            {
                response.Posts.Add(new PostResponse
                {
                    CreationTime = p.CreationTime,
                    PostId = p.PostId,
                    Text = p.Text,
                    Title = p.Title,
                    UserId = p.UserId,
                    User = new UserInfoResponse
                    {
                        UserId = user.UserId,
                        Name = user.Name,
                        Surname = user.Surname,
                        MaidenName = user.MaidenName,
                        PictureUrl = user.PictureUrl
                    }
                });
            }
            return response;
        }

        public async Task<PostResponse> ModifyPostAsync(int userId, ModifyPostRequest model)
        {
            var post = await context.Posts.FirstOrDefaultAsync(post => post.PostId == model.PostId);
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (post == null || (post.UserId != userId && !user.Role.Equals(Role.Admin)))
                return null;
            if (!string.IsNullOrWhiteSpace(model.Text))
            {
                post.Text = model.Text;
            }
            if (!string.IsNullOrWhiteSpace(model.Title))
            {
                post.Title = model.Title;
            }
            await context.SaveChangesAsync();
            return await GetPostAsync(post.PostId);
        }
        private PostResponse CreateResponse(Post post, User user)
        {
            return new PostResponse
            {
                PostId = post.PostId,
                UserId = post.UserId,
                Title = post.Title,
                Text = post.Text,
                CreationTime = post.CreationTime,
                PictureUrl = post.PictureUrl,
                User = new UserInfoResponse
                {
                    UserId = user.UserId,
                    Name = user.Name,
                    Surname = user.Surname,
                    MaidenName = user.MaidenName,
                    PictureUrl = user.PictureUrl
                }
            };
        }
    }
}
