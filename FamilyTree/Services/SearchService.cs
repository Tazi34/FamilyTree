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
        public TreesListSearchResponse FindTrees(string expression);
        public UsersListSearchResponse FindUsers(string expression);
    }
    public class SearchService : ISearchService
    {
        private DataContext context;
        public SearchService(DataContext dataContext)
        {
            context = dataContext;
        }

        public TreesListSearchResponse FindTrees(string expression)
        {
            throw new NotImplementedException();
        }

        public UsersListSearchResponse FindUsers(string expression)
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
        private UsersListSearchResponse CreateUsersList(List<User> exact, List<User> startsWith, List<User> prevSurnames)
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
        private UsersListSearchResponse CreateUserResponse(List<User> userList)
        {
            var userListSearchResponse = new UsersListSearchResponse
            {
                Users = new List<UserSearchResponse>()
            };
            foreach(User user in userList)
            {
                userListSearchResponse.Users.Add(new UserSearchResponse
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
