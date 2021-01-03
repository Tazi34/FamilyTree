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
using Microsoft.AspNetCore.Authorization;

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
        /// <summary>
        /// Zwraca drzewo o danym Id
        /// </summary>
        /// <param name="treeId">Id drzewa</param>
        /// <returns></returns>
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
        /// <summary>
        /// Zwraca node o danym Id
        /// </summary>
        /// <param name="nodeId">Id node-a</param>
        /// <returns></returns>
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
        /// <summary>
        /// Zwraca listę drzew użytkownika do wyświetlenia na profilu (drzewa publiczne + drzewa prywatne w których jest użytkownik z JWT)
        /// </summary>
        /// <param name="userId">Id użytkownika</param>
        /// <returns></returns>
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
        /// <summary>
        /// Tworzy nowe drzewo z jednym nodem, w którym jest umieszczany użytkownik
        /// </summary>
        /// <param name="model">CreateTreeRequest</param>
        /// <returns>Zwraca stworzone drzewo</returns>
        [HttpPost]
        [Authorize]
        [Route("")]
        public ActionResult<TreeResponse> CreateTree(CreateTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.CreateTree(userId, model);
            if (tree == null)
                return BadRequest("Error occured");
            return Ok(tree);
        }

        /// <summary>
        /// Przenosi węzeł w podane miejsce
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize]
        [Route("node/move")]
        public ActionResult<MoveNodeResponse> MoveNode(MoveNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var response = treeService.MoveNode(userId, model);
            if (response == null)
                return BadRequest("Error occured");
            return Ok(response);
        }

        /// <summary>
        /// Modyfikuje drzewo (nazwa drzewa, czy prywatne)
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Zwraca całe zmodyfikowane drzewo</returns>
        [HttpPut]
        [Authorize]
        [Route("")]
        public ActionResult<TreeResponse> ModifyTree(ModifyTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.ModifyTree(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }
        /// <summary>
        /// Tworzy nowy node
        /// </summary>
        /// <param name="model">CreateNodeRequest</param>
        /// <returns>Zwraca całe drzewo</returns>
        [HttpPost]
        [Authorize]
        [Route("node")]
        public ActionResult<TreeResponse> CreateNode(CreateNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.CreateNode(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }

        /// <summary>
        /// Tworzy nowy wezel jako brat podanego wezla - jesli nie maja rodzica tworzy "fake" rodzica
        /// </summary>
        /// <param name="model">AddSiblingRequest</param>
        /// <returns>Zwraca całe drzewo</returns>
        [HttpPost]
        [Authorize]
        [Route("node/addSibling")]
        public ActionResult<TreeResponse> AddSibling(AddSiblingRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.AddSibling(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }
        /// <summary>
        /// Modyfikuje node
        /// </summary>
        /// <param name="model">ModifyNodeRequest</param>
        /// <returns>Zwraca całe drzewo</returns>
        [HttpPut]
        [Authorize]
        [Route("node")]
        public ActionResult<TreeResponse> ModifyNode(ModifyNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = treeService.ModifyNode(userId, model);
            if (tree == null)
                return BadRequest("No authorization or other error");
            return Ok(tree);
        }
        /// <summary>
        /// Usuwa node z drzewa
        /// </summary>
        /// <param name="node_id">id node do usunięcia</param>
        /// <returns>status</returns>
        [HttpDelete]
        [Authorize]
        [Route("node/{node_id:int}")]
        public ActionResult<TreeResponse> DeleteNode(int node_id)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = treeService.DeleteNode(userId, node_id);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
        [HttpDelete]
        [Authorize]
        [Route("{tree_id:int}")]
        public ActionResult DeleteTree(int tree_id)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            bool result = treeService.DeleteTree(userId, tree_id);
            if (!result)
                return BadRequest();
            return Ok();
        }
    }
}