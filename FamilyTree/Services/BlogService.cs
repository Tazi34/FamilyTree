using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Models;
using FamilyTree.Helpers;
using FamilyTree.Entities;

namespace FamilyTree.Services
{
    public interface IBlogService
    {
        public BlogListResponse GetPostsList(int userId);
        public PostResponse GetPost(int postId);
        public PostResponse CreatePost(int userId, CreatePostRequest model);
        public PostResponse ModifyPost(int userId, ModifyPostRequest model);
    }
    public class BlogService : IBlogService
    {
        private DataContext context;
        public BlogService(DataContext dataContext)
        {
            context = dataContext;
        }

        public PostResponse CreatePost(int userId, CreatePostRequest model)
        {
            var user = context.Users.SingleOrDefault(user => user.UserId == userId);
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
            context.SaveChangesAsync();
            return GetPost(newPost.PostId);
        }

        public PostResponse GetPost(int postId)
        {
            var post = context.Posts.SingleOrDefault(post => post.PostId == postId);
            if (post == null)
                return null;
            var response = new PostResponse
            {
                PostId = post.PostId,
                UserId = post.UserId,
                Title = post.Title,
                Text = post.Text,
                CreationTime = post.CreationTime,
                PictureUrl = post.PictureUrl
            };
            return response;
        }

        public BlogListResponse GetPostsList(int userId)
        {
            var postsList = context.Posts.Where(post => post.UserId == userId);
            var response = new BlogListResponse
            {
                Posts = new List<SimplePost>()
            };
            foreach(Post p in postsList)
            {
                response.Posts.Add(new SimplePost
                {
                    CreationTime = p.CreationTime,
                    PostId = p.PostId
                });
            }
            return response;
        }

        public PostResponse ModifyPost(int userId, ModifyPostRequest model)
        {
            var post = context.Posts.SingleOrDefault(post => post.PostId == model.PostId);
            if (post == null || post.UserId != userId)
                return null;
            if (!string.IsNullOrWhiteSpace(model.Text))
            {
                post.Text = model.Text;
            }
            if (!string.IsNullOrWhiteSpace(model.Title))
            {
                post.Title = model.Title;
            }
            context.SaveChanges();
            return GetPost(post.PostId);
        }
    }
}
