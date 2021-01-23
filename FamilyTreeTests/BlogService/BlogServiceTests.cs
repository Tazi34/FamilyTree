using NUnit.Framework;
using FamilyTree.Services;
using Moq;
using FamilyTree.Entities;
using FamilyTree.Helpers;
using FamilyTree.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FamilyTreeTests.Blog
{
    public class Tests
    {
        private BlogService service;
        private Post post = new Post();
        private User user = new User();
        private DbContextOptions<DataContext> contextOptions = new DbContextOptionsBuilder<DataContext>().UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=UnitTestsFamilyTree;Trusted_Connection=True;").Options;
        private DataContext context;
        private void Seed()
        {
            using (var context = new DataContext(contextOptions))
            {
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();

                user = new User
                {
                    Name = "TestName",
                    Surname = "TestSurname"
                };
                context.Users.Add(user);
                context.SaveChanges();
                post = new Post
                {
                    Text = "Test text",
                    Title = "Test title",
                    UserId = user.UserId
                };
                context.Posts.Add(post);
                context.SaveChanges();
            }
        }
        [SetUp]
        public void Setup()
        {
            context = new DataContext(contextOptions);
            service = new BlogService(context);
            Seed();
        }
        [TearDown]
        public void TearDown()
        {
            context.Dispose();
        }

        [Test]
        public async Task GetPostSuccess()
        {
            var post = await service.GetPostAsync(1);
            Assert.IsNotNull(post);
        }
        [Test]
        public async Task GetPostFail()
        {
            var post = await service.GetPostAsync(0);
            Assert.IsNull(post);
        }
        [Test]
        public async Task CreatePostSuccess()
        {
            var postRequest = new CreatePostRequest
            {
                Text = "New posts text",
                Title = "New post title"
            };
            var post = await service.CreatePostAsync(user.UserId, postRequest);

            Assert.IsNotNull(post);
            Assert.IsTrue(post.Text.Equals("New posts text"));
            Assert.IsTrue(post.Title.Equals("New post title"));
            Assert.IsNotNull(post.PostId);
        }
        [Test]
        public async Task CreatePostFail()
        {
            var postRequest = new CreatePostRequest
            {
                Text = "New posts text",
                Title = "New post title"
            };
            var post = await service.CreatePostAsync(0, postRequest);
            Assert.IsNull(post);
        }
        [Test]
        public async Task GetListSuccess()
        {
            var blog = await service.GetPostsListAsync(1);
            Assert.IsNotNull(blog);
            Assert.AreEqual(blog.Posts.Count, 1);
        }
        [Test]
        public async Task GetListFail()
        {
            var blog = await service.GetPostsListAsync(0);
            Assert.IsNull(blog);  
        }
    }
}