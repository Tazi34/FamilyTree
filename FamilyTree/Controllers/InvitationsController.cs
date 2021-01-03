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
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class InvitationsController : ControllerBase
    {
        private IInvitationService invitationService;
        public InvitationsController(IInvitationService invitationService)
        {
            this.invitationService = invitationService;
        }
        /// <summary>
        /// Tworzy zaproszenie do drzewa
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("")]
        [HttpPost]
        public async Task<ActionResult> CreateInvitation(CreateInvitationRequest model)
        {
            model.HostUserId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await invitationService.CreateInvitationAsync(model);
            if (!result)
                return BadRequest();
            return Ok();
        }
        /// <summary>
        /// Akceptuje zaproszenie - tworzy nowy node w drzewie
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("accept")]
        [HttpPost]
        public async Task<ActionResult<TreeResponse>> AcceptInvitation(AcceptRefuseInvitationRequest model)
        {
            model.UserId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await invitationService.AcceptInvitationAsync(model);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
        /// <summary>
        /// Odrzuca zaproszenie
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("refuse")]
        [HttpPost]
        public async Task<ActionResult> RefuseInvitation(AcceptRefuseInvitationRequest model)
        {
            model.UserId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await invitationService.RefuseInvitationAsync(model);
            if (!result)
                return BadRequest();
            return Ok();
        }
        /// <summary>
        /// Zwraca listę zaproszeń użytkownika
        /// </summary>
        /// <returns></returns>
        [Route("")]
        [HttpGet]
        public async Task<ActionResult<InvitationsListResponse>> GetInvitationsList()
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var result = await invitationService.GetInvitationsAsync(userId);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
    }
}
