using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Services;
using FamilyTree.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private IBlogService blogService;
        private IPictureService pictureService;
        public BlogController(IBlogService blogService, IPictureService pictureService)
        {
            this.blogService = blogService;
            this.pictureService = pictureService;
        }
        /// <summary>
        /// Zwraca listę wszystkich id postów użytkownika wraz z datami utworzenia
        /// </summary>
        /// <param name="userId">Id użytkwnika</param>
        /// <returns></returns>
        [Route("{userId:int}")]
        [HttpGet]
        public ActionResult<BlogListResponse> GetBlogList(int userId)
        {
            var resultList = blogService.GetPostsList(userId);
            return Ok(resultList);
        }
        /// <summary>
        /// Zwraca post o podanym Id
        /// </summary>
        /// <param name="postId">Id posta</param>
        /// <returns>Z</returns>
        [Route("post/{postId:int}")]
        [HttpGet]
        public ActionResult<PostResponse> GetPost(int postId)
        {
            var post = blogService.GetPost(postId);
            if (post == null)
                return BadRequest();
            return Ok(post);
        }
        /// <summary>
        /// Dodaje post dla użytkownika z JWT
        /// </summary>
        /// <param name="model">JSON CreatePostRequest</param>
        /// <returns>Zwraca nowo dodany post</returns>
        [Route("")]
        [Authorize]
        [HttpPost]
        public ActionResult<PostResponse> CreatePost(CreatePostRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var newPost = blogService.CreatePost(userId, model);
            if (newPost == null)
                return BadRequest();
            return Ok(newPost);
        }
        /// <summary>
        /// Modyfikuje post użytkownika z JWT
        /// </summary>
        /// <param name="model">JSON ModifyPostRequest</param>
        /// <returns>Zwraca zmodyfikowany post</returns>
        [Route("")]
        [Authorize]
        [HttpPut]
        public ActionResult<PostResponse> ModifyPost(ModifyPostRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var modifiedPost = blogService.ModifyPost(userId, model);
            if (modifiedPost == null)
                return BadRequest();
            return Ok(modifiedPost);
        }
        /// <summary>
        /// Usuwa post
        /// </summary>
        /// <returns></returns>
        [Route("{postId:int}")]
        [Authorize]
        [HttpDelete]
        public ActionResult DeletePost(int postId)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = blogService.DeletePost(userId, postId);
            if (!result)
                return BadRequest();
            return Ok();
        }
        /// <summary>
        /// Dodaje zdjęcie do chmury, zwraca URL
        /// </summary>
        /// <param name="picture"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("picture")]
        [Authorize]
        public async Task<ActionResult<SetPictureResponse>> SetUserPicture(IFormFile picture)
        {
            var response = await pictureService.SetBlogPicture(picture);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
    }
}