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
        private IPictureService pictureService;
        public TreeController(ITreeService treeService, IPictureService pictureService)
        {
            this.treeService = treeService;
            this.pictureService = pictureService;
        }
        /// <summary>
        /// Zwraca drzewo o danym Id
        /// </summary>
        /// <param name="treeId">Id drzewa</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{treeId:int}")]
        public async Task<ActionResult<DrawableTreeResponse>> GetTree(int treeId)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var tree = await treeService.GetTreeAsync(treeId, userId);
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
        public async Task<ActionResult<NodeResponse>> GetNode(int nodeId)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var node = await treeService.GetNodeAsync(nodeId, userId);
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
        public async Task<ActionResult<TreeUserResponse>> GetUserTrees(int userId)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userIdFromClaim = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var trees = await treeService.GetUserTreesAsync(userId, userIdFromClaim);
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
        public async Task<ActionResult<DrawableTreeResponse>> CreateTree(CreateTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = await treeService.CreateTreeAsync(userId, model);
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
        public async Task<ActionResult<MoveNodeResponse>> MoveNode(MoveNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var response = await treeService.MoveNodeAsync(userId, model);
            if (response == null)
                return BadRequest("Error occured");
            return Ok(response);
        }
        /// <summary>
        /// Ustawia polaczenia dziecko <---> rodzice. Sluzy do podpiania istniejacych juz wezlow
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        [Route("node/connect")]
        public async Task<ActionResult<DrawableTreeResponse>> ConnectNodes(int nodeId, ConnectNodesRequest model)
        {
            var userIdClaim = HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name);
            var userId = userIdClaim == null ? 0 : int.Parse(userIdClaim.Value);
            var tree = await treeService.ConnectNodesAsync(userId, model);

            if (tree == null)
                return BadRequest("Error");
            return Ok(tree);
        }

        /// <summary>
        /// Modyfikuje drzewo (nazwa drzewa, czy prywatne)
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Zwraca całe zmodyfikowane drzewo</returns>
        [HttpPut]
        [Authorize]
        [Route("")]
        public async Task<ActionResult<DrawableTreeResponse>> ModifyTree(ModifyTreeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = await treeService.ModifyTreeAsync(userId, model);
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
        public async Task<ActionResult<NodeResponse>> CreateNode(CreateNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = await treeService.CreateNodeAsync(userId, model);
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
        public async Task<ActionResult<DrawableTreeResponse>> AddSibling(AddSiblingRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = await treeService.AddSiblingAsync(userId, model);
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
        public async Task<ActionResult<DrawableTreeResponse>> ModifyNode(ModifyNodeRequest model)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var tree = await treeService.ModifyNodeAsync(userId, model);
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
        public async Task<ActionResult<DrawableTreeResponse>> DeleteNode(int node_id)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await treeService.DeleteNodeAsync(userId, node_id);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
        [HttpDelete]
        [Authorize]
        [Route("{tree_id:int}")]
        public async Task<ActionResult> DeleteTree(int tree_id)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            bool result = await treeService.DeleteTreeAsync(userId, tree_id);
            if (!result)
                return BadRequest();
            return Ok();
        }
        /// <summary>
        /// Ustawia zdjęcie dla node
        /// </summary>
        /// <param name="picture"></param>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        [Route("picture")]
        public async Task<ActionResult<SetPictureResponse>> SetNodePicture(IFormFile picture, [FromForm] string nodeId)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            int nodeIdParsed = int.Parse(nodeId);
            var response = await pictureService.SetNodePicture(userId, nodeIdParsed, picture);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
        /// <summary>
        /// Usuwa zdjęcie dla node
        /// </summary>
        /// <param name="nodeId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize]
        [Route("picture/{nodeId:int}")]
        public async Task<ActionResult<SetPictureResponse>> DeleteNodePicture(int nodeId)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var response = await pictureService.DeleteNodePicture(userId, nodeId);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
    }
}