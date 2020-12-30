using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Models;
using FamilyTree.Helpers;
using FamilyTree.Entities;
using Microsoft.EntityFrameworkCore;

namespace FamilyTree.Services
{
    public interface ISearchService
    {
        public SearchResponse Find(string expression);
    }
    public class SearchService : ISearchService
    {
        private DataContext context;
        public SearchService(DataContext dataContext)
        {
            context = dataContext;
        }
        public SearchResponse Find(string expression)
        {
            return new SearchResponse
            {
                Trees = FindTrees(expression),
                Users = FindUsers(expression)
            };
        }

        public List<TreeSearchResponse> FindTrees(string expression)
        {
            string exp = expression.Trim().ToUpper();
            var surnameExpList = expression.Split().ToList();
            List<Tree> exactResults = null, contains1Results = null, contains2Results, surnamesResults = new List<Tree>(); ;
            exactResults = context.Trees.Where(t => !t.IsPrivate && t.Name.ToUpper().Equals(exp)).Take(20).ToList();
            contains1Results = context.Trees.Where(t => !t.IsPrivate && t.Name.ToUpper().Contains(exp)).Take(20).ToList();
            contains2Results = context.Trees.Where(t => !t.IsPrivate && exp.Contains(t.Name.ToUpper())).Take(20).ToList();
            if (surnameExpList.Any())
                surnamesResults = context.Trees.Include(t => t.Nodes).Where(t => t.Nodes.Any(n => n.Surname.ToUpper().Equals(surnameExpList[0]))).Take(20).ToList();
            return CreateTreesList(exactResults, contains1Results, contains2Results, surnamesResults);
        }
        private List<TreeSearchResponse> CreateTreesList(List<Tree> exact, List<Tree> contains1, List<Tree> contains2, List<Tree> surnames)
        {
            var resultList = new List<Tree>();
            resultList.AddRange(exact);
            resultList.AddRange(contains1);
            resultList.AddRange(contains2);
            resultList = resultList.Distinct().ToList();
            if (surnames.Count() > 5)
            {
                resultList = resultList.Take(15).ToList();
                resultList.AddRange(surnames.Take(5));
            }
            else
            {
                resultList = resultList.Take(20 - surnames.Count).ToList();
                resultList.AddRange(surnames);
            }
            return CreateTreeResponseList(resultList.Distinct().ToList());
        }
        private List<TreeSearchResponse> CreateTreeResponseList(List<Tree> treeList)
        {
            var response = new List<TreeSearchResponse>();
            foreach(Tree t in treeList)
            {
                response.Add(new TreeSearchResponse
                {
                    IsPrivate = t.IsPrivate,
                    Name = t.Name,
                    TreeId = t.TreeId
                });
            }
            return response;
        }

        public List<UserSearchResponse> FindUsers(string expression)
        {
            var splittedExpression = new List<string>(expression.ToUpper().Split());
            splittedExpression.RemoveAll(s => s.Equals(""));
            List<User> exactResults = null, startsWithResults = null, prevSurnamesResults = null;
            if(splittedExpression.Count >= 2)
            {
                exactResults = context.Users.Include(u => u.PrevSurnames)
                    .Where(u => u.Name.ToUpper().Equals(splittedExpression[0]) && (u.Surname.ToUpper().Equals(splittedExpression[1]))).Take(20).ToList();
                startsWithResults = context.Users.Include(u => u.PrevSurnames)
                    .Where(u => u.Name.ToUpper().StartsWith(splittedExpression[0]) && (u.Surname.ToUpper().StartsWith(splittedExpression[1]))).Take(20).ToList();
                prevSurnamesResults = context.Users.Include(u => u.PrevSurnames)
                    .Where(u => u.Name.ToUpper().Equals(splittedExpression[0]) && u.PrevSurnames.Any(p => p.Surname.ToUpper().Equals(splittedExpression[1]))).Take(20).ToList();
            }
            else if(splittedExpression.Count == 1)
            {
                exactResults = context.Users.Include(u => u.PrevSurnames)
                    .Where(u => (u.Surname.ToUpper().Equals(splittedExpression[0]))).Take(20).ToList();
                startsWithResults = context.Users.Include(u => u.PrevSurnames)
                    .Where(u => (u.Surname.ToUpper().StartsWith(splittedExpression[0]))).Take(20).ToList();
                prevSurnamesResults = context.Users.Include(u => u.PrevSurnames)
                    .Where(u => u.PrevSurnames.Any(p => p.Surname.ToUpper().Equals(splittedExpression[0]))).Take(20).ToList();
            }
            else if (splittedExpression.Count == 0)
                exactResults = startsWithResults = prevSurnamesResults = new List<User>();
            return CreateUsersList(exactResults, startsWithResults, prevSurnamesResults);
        }
        private List<UserSearchResponse> CreateUsersList(List<User> exact, List<User> startsWith, List<User> prevSurnames)
        {
            List<User> resultList = new List<User>();
            resultList.AddRange(exact);
            resultList.AddRange(startsWith);
            resultList = resultList.Distinct().ToList();
            if (prevSurnames.Count >= 5)
            {
                resultList = resultList.Take(15).ToList();
                resultList.AddRange(prevSurnames.Take(5));
            }
            else
            {
                resultList = resultList.Take(20 - prevSurnames.Count).ToList();
                resultList.AddRange(prevSurnames);
            }
            return CreateUserResponse(resultList);
        }
        private List<UserSearchResponse> CreateUserResponse(List<User> userList)
        {
            var userListSearchResponse = new List<UserSearchResponse>();
            foreach(User user in userList)
            {
                userListSearchResponse.Add(new UserSearchResponse
                {
                    Name = user.Name,
                    Surname = user.Surname,
                    UserId = user.UserId,
                    PictureUrl = user.PictureUrl,
                    prevSurnames = CreatePrevsurnameList(user.PrevSurnames)
                });
            }
            return userListSearchResponse;
        }
        private List<string> CreatePrevsurnameList(List<PreviousSurname> prevSurnameList)
        {
            var stringList = new List<string>();
            foreach(var prevSurname in prevSurnameList)
                stringList.Add(prevSurname.Surname);
            return stringList;
        }
    }
}
