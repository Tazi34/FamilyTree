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
        /// Wyszukuje do 20 drzew o nazwie zbliżonej do argumentu oraz 20 użytkowników
        /// </summary>
        /// <param name="expression"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{expression}")]
        public ActionResult<SearchResponse> Find(string expression)
        {
            var response = searchService.Find(expression);
            if (response == null)
                return BadRequest();
            return Ok(response);
        }
    }
}
