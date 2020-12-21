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
        public bool DeletePost(int userId, int postId);
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
            context.SaveChanges();
            return CreateResponse(newPost);
        }

        public bool DeletePost(int userId, int postId)
        {
            var post = context.Posts.SingleOrDefault(post => post.PostId == postId);
            if (post == null || post.UserId != userId)
                return false;
            context.Posts.Remove(post);
            context.SaveChanges();
            return true;
        }

        public PostResponse GetPost(int postId)
        {
            var post = context.Posts.SingleOrDefault(post => post.PostId == postId);
            if (post == null)
                return null;
            return CreateResponse(post);
        }

        public BlogListResponse GetPostsList(int userId)
        {
            var postsList = context.Posts.Where(post => post.UserId == userId);
            var user = context.Users.SingleOrDefault(user => user.UserId == userId);
            if (user == null)
            {
                return null;
            }
            var response = new BlogListResponse
            {
                User = new BlogUserProfileResponse
                {
                    UserId = user.UserId,
                    Name = user.Name,
                    Surname = user.Surname,
                    PictureUrl =user.PictureUrl
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
                    UserId = p.UserId
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
        private PostResponse CreateResponse(Post post)
        {
            return new PostResponse
            {
                PostId = post.PostId,
                UserId = post.UserId,
                Title = post.Title,
                Text = post.Text,
                CreationTime = post.CreationTime,
                PictureUrl = post.PictureUrl
            };
        }
    }
}
