using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Services;
using FamilyTree.Entities;
using FamilyTree.Models;
using System.Security.Claims;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TreeController : ControllerBase
    {
        private ITreeService treeService;
        public TreeController(ITreeService treeService)
        {
            this.treeService = treeService;
        }
        [HttpGet]
        [Route("{treeId:int}")]
        public ActionResult<TreeResponse> GetTree(int treeId)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var tree = treeService.GetTree(treeId, userId);
            if (tree == null)
                return BadRequest("no such tree, or tree is private");
            return Ok(tree);
        }
        [HttpGet]
        [Route("node/{nodeId:int}")]
        public ActionResult<NodeResponse> GetNode(int nodeId)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var node = treeService.GetNode(nodeId, userId);
            if (node == null)
                return BadRequest("no such node, or tree is private");
            return Ok(node);
        }
        [HttpGet]
        [Route("user/{userId:int}")]
        public ActionResult<TreeUserResponse> GetUserTrees(int userId)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userIdFromClaim = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var trees = treeService.GetUserTrees(userId, userIdFromClaim);
            if (trees == null)
                return BadRequest("no such user, or sth");
            return Ok(trees);
        }
        [HttpPost]
        [Route("")]
        public ActionResult<TreeResponse> CreateTree(CreateTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.CreateTree(userId, model);
            if (tree == null)
                return BadRequest("Error occured");
            return Ok(tree);
        }
        [HttpPut]
        [Route("")]
        public ActionResult<TreeResponse> ModifyTree(ModifyTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.ModifyTree(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }
        [HttpPost]
        [Route("node")]
        public ActionResult<TreeResponse> CreateNode(CreateNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.CreateNode(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }
        [HttpPut]
        [Route("node")]
        public ActionResult<TreeResponse> ModifyNode(ModifyNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.ModifyNode(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }
    }
}