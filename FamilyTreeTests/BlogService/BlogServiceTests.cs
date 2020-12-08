using NUnit.Framework;
using FamilyTree.Services;
using Moq;
using FamilyTree.Entities;
using FamilyTree.Helpers;
using FamilyTree.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using FamilyTreeTests.Helpers;

namespace FamilyTreeTests.Blog
{
    public class Tests
    {
        private BlogService service;
        private Mock<DbSet<Post>> mockSetPost;
        private Mock<DbSet<User>> mockSetUser;
        private Mock<DataContext> mockContext;
        private Post post = new Post
        {
            PostId = 1,
            Text = "Test text",
            Title = "Test title",
            UserId = 1
        };
        private User user = new User
        {
            UserId = 1,
            Name = "TestName",
            Surname = "TestSurname"
        };
        [SetUp]
        public void Setup()
        {
            var Posts = new List<Post>{post}.AsQueryable();
            var Users = new List<User>{user}.AsQueryable();

            mockSetPost = CreateDbMock.Create(Posts);
            mockSetUser = CreateDbMock.Create(Users);

            mockContext = new Mock<DataContext>();
            mockContext.Setup(m => m.Posts).Returns(mockSetPost.Object);
            mockContext.Setup(m => m.Users).Returns(mockSetUser.Object);

            service = new BlogService(mockContext.Object);
        }

        [Test]
        public void GetPostSuccess()
        {
            var post = service.GetPost(1);
            Assert.IsNotNull(post);
        }
        [Test]
        public void GetPostFail()
        {
            var post = service.GetPost(0);
            Assert.IsNull(post);
        }
        [Test]
        public void CreatePostSuccess()
        {
            var postRequest = new CreatePostRequest
            {
                Text = "New posts text",
                Title = "New post title"
            };
            var post = service.CreatePost(1, postRequest);

            mockSetPost.Verify(m => m.Add(It.IsAny<Post>()), Times.Once);
            mockContext.Verify(m => m.SaveChanges(), Times.Once);

            Assert.IsNotNull(post);
            Assert.IsTrue(post.Text.Equals("New posts text"));
            Assert.IsTrue(post.Title.Equals("New post title"));
            Assert.IsNotNull(post.PostId);
        }
        [Test]
        public void CreatePostFail()
        {
            var postRequest = new CreatePostRequest
            {
                Text = "New posts text",
                Title = "New post title"
            };
            var post = service.CreatePost(0, postRequest);
            Assert.IsNull(post);
        }
        [Test]
        public void GetListSuccess()
        {
            var blog = service.GetPostsList(1);
            Assert.IsNotNull(blog);
            Assert.AreEqual(blog.Posts.Count, 1);
        }
        [Test]
        public void GetListFail()
        {
            var blog = service.GetPostsList(0);
            //Assert.IsNotNull(blog);
            Assert.AreEqual(blog.Posts.Count, 0);
        }
    }
}