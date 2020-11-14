using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;

namespace FamilyTree.Helpers
{
    public class AddTestData
    {
        public static void AddData(DataContext context)
        {
            var testUser1 = new User
            {
                UserId = 1,
                Name = "Krzys",
                Surname = "Kicun",
                Email = "abc@kicunmail",
                Birthday = DateTime.Today
            };
            var testPrevSurname1 = new PreviousSurname
            {
                PreviousSurnameId = 1,
                Surname = "Miekki",
                UserId = 1
            };
            var testPrevSurname2 = new PreviousSurname
            {
                PreviousSurnameId = 2,
                Surname = "Bak",
                UserId = 1
            };
            context.PreviousSurnames.Add(testPrevSurname1);
            context.PreviousSurnames.Add(testPrevSurname2);
            context.Users.Add(testUser1);
            context.SaveChanges();
        }
    }
}