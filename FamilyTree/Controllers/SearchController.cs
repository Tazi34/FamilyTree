using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FamilyTree.Services;
using FamilyTree.Models;

namespace FamilyTree.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private ISearchService searchService;
        public SearchController(ISearchService searchService)
        {
            this.searchService = searchService;
        }
        /// <summary>
        /// Wyszukuje do 20 użytkowników o imieniu i nazwisku zbliżonych do argumentu
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("user/{expression}")]
        public ActionResult<UsersListSearchResponse> FindUsers(string expression)
        {
            var response = searchService.FindUsers(expression);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
        /// <summary>
        /// Wyszukuje do 20 drzew o nazwie zbliżonej do argumentu
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("tree/{expression}")]
        public ActionResult<TreesListSearchResponse> FindTrees(string expression)
        {
            var response = searchService.FindTrees(expression);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
    }
}
