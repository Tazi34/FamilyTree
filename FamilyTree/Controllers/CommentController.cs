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
    public class CommentController:ControllerBase
    {
        private ICommentService commentService;
        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }
        /// <summary>
        /// Pobiera wszystkie komentarze dla danego posta, posortowane po dacie dodawania
        /// </summary>
        /// <param name="postId"></param>
        /// <returns></returns>
        [Route("{postId:int}")]
        [HttpGet]
        public async Task<ActionResult<CommentsListResponse>> GetCommentsList(int postId)
        {
            var resultList = await commentService.GetCommentsList(postId);
            if (resultList == null)
                return BadRequest();
            return Ok(resultList);
        }
        /// <summary>
        /// Tworzy komentarz
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authorize]
        [Route("")]
        [HttpPost]
        public async Task<ActionResult<CommentsListResponse>> PostComment(CreateCommentRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await commentService.CreateComment(userId, model);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
        /// <summary>
        /// Usuwa komentarz
        /// </summary>
        /// <param name="commentId"></param>
        /// <returns></returns>
        [Authorize]
        [Route("{commentId:int}")]
        [HttpDelete]
        public async Task<ActionResult<CommentsListResponse>> DeleteComment(int commentId)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await commentService.DeleteComment(userId, commentId);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
        /// <summary>
        /// Modyfikuje komentarz
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Authorize]
        [Route("")]
        [HttpPut]
        public async Task<ActionResult<CommentsListResponse>> ModifyComment(ModifyCommentRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await commentService.ModifyComment(userId, model);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
    }
}
