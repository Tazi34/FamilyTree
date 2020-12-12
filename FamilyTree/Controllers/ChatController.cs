using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Services;
using FamilyTree.Models;
using System.Security.Claims;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController: ControllerBase
    {
        private IChatService chatService;
        public ChatController(IChatService chatService)
        {
            this.chatService = chatService;
        }
        /// <summary>
        /// Pobiera ostatnich 100 wiadomości wymienionych z jednym z użytkowników
        /// </summary>
        /// <param name="chatUser">Id użytkownika z którym była prowadzona rozmowa</param>
        /// <returns></returns>
        [Route("messages/{chatUser:int}")]
        [HttpGet]
        public ActionResult<MessagesListResponse> GetMessagesList(int chatUser)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var resultList = chatService.GetMessages(userId, chatUser);
            if (resultList == null)
                return BadRequest();
            return Ok(resultList);
        }
        /// <summary>
        /// Zwraca listę 10 ostatnich użytkowników, z którymi była prowadzona rozmowa
        /// </summary>
        /// <returns></returns>
        [Route("")]
        [HttpGet]
        public ActionResult<MessagesListResponse> GetLastUsersList()
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var resultList = chatService.GetLastUsersList(userId);
            if (resultList == null)
                return BadRequest();
            return Ok(resultList);
        }
    }
}
