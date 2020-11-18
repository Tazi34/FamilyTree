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
        private ITreeService _tree_service;
        public TreeController(ITreeService tree_service)
        {
            _tree_service = tree_service;
        }
        [HttpGet]
        [Route("{tree_id:int}")]
        public ActionResult<TreeResponse> GetTree(int tree_id)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var tree = _tree_service.GetTree(tree_id, userId);
            if (tree == null)
                return BadRequest("no such tree, or tree is private");
            return Ok(tree);
        }
        [HttpGet]
        [Route("node/{node_id:int}")]
        public ActionResult<NodeResponse> GetNode(int node_id)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var node = _tree_service.GetNode(node_id, userId);
            if (node == null)
                return BadRequest("no such node, or tree is private");
            return Ok(node);
        }
        [HttpGet]
        [Route("user/{user_id:int}")]
        public ActionResult<TreeUserResponse> GetUserTrees(int user_id)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userIdFromClaim = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var trees = _tree_service.GetUserTrees(user_id, userIdFromClaim);
            if (trees == null)
                return BadRequest("no such user, or sth");
            return Ok(trees);
        }
        [HttpPost]
        [Route("")]
        public ActionResult<TreeResponse> CreateTree(CreateTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = _tree_service.CreateTree(userId, model);
            if (tree == null)
                return BadRequest("Error occured");
            return Ok(tree);
        }
    }
}