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
        public async Task<ActionResult<MessagesListResponse>> GetMessagesList(int chatUser)
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var resultList = await chatService.GetMessagesAsync(userId, chatUser);
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
        public async Task<ActionResult<MessagesListResponse>> GetLastUsersList()
        {
            var userId = int.Parse(HttpContext.User.Claims.SingleOrDefault(claim => claim.Type == ClaimTypes.Name).Value);
            var resultList = await chatService.GetLastUsersListAsync(userId);
            if (resultList == null)
                return BadRequest();
            return Ok(resultList);
        }
        /// <summary>
        /// Pobiera podstawowe informacje o userze
        /// </summary>
        /// <param name="chatUser">Id użytkownika z którym była prowadzona rozmowa</param>
        /// <returns></returns>
        [Route("{chatUser:int}")]
        [HttpGet]
        public async Task<ActionResult<UserInfoResponse>> GetChatUserInfo(int chatUser)
        {
            var resultList = await chatService.GetChatUserInfoAsync(chatUser);
            if (resultList == null)
                return BadRequest();
            return Ok(resultList);
        }
    }
}
