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
            //#region users
            //var testUser1 = new User
            //{
            //    UserId = 1,
            //    Name = "Krzys",
            //    Surname = "Kicun",
            //    Email = "abc@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "haslo123",
            //    Role = Role.User,
            //    PrevSurnames = new List<PreviousSurname>()
            //};
            //var testPrevSurname1 = new PreviousSurname
            //{
            //    PreviousSurnameId = 1,
            //    Surname = "PrevNazwisko1",
            //    UserId = 1
            //};
            //var testPrevSurname2 = new PreviousSurname
            //{
            //    PreviousSurnameId = 2,
            //    Surname = "PrevNazwisko2",
            //    UserId = 1
            //};
            //var testUser2 = new User
            //{
            //    UserId = 2,
            //    Name = "Brat",
            //    Surname = "Kicun",
            //    Email = "brat@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "brat",
            //    Role = Role.User
            //};
            //var testUser3 = new User
            //{
            //    UserId = 3,
            //    Name = "Siostra",
            //    Surname = "Kicun",
            //    Email = "siostra@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "siostra",
            //    Role = Role.User
            //};
            //var testUser4 = new User
            //{
            //    UserId = 4,
            //    Name = "ojciec",
            //    Surname = "Kicun",
            //    Email = "ojciec@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "ojciec",
            //    Role = Role.User
            //};
            //var testUser5 = new User
            //{
            //    UserId = 5,
            //    Name = "mama",
            //    Surname = "Kicun",
            //    Email = "mama@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "mama",
            //    Role = Role.User
            //};
            //var testUser6 = new User
            //{
            //    UserId = 6,
            //    Name = "dziadek",
            //    Surname = "Kicun",
            //    Email = "dziadek@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "dziadek",
            //    Role = Role.User
            //};
            //var testUser7 = new User
            //{
            //    UserId = 7,
            //    Name = "babcia",
            //    Surname = "Kicun",
            //    Email = "babcia@kicunmail",
            //    Birthday = DateTime.Today,
            //    PasswordHash = "babcia",
            //    Role = Role.User
            //};
            //testUser1.PrevSurnames.Add(testPrevSurname1);
            //testUser1.PrevSurnames.Add(testPrevSurname2);
            //context.Users.Add(testUser1);
            //context.Users.Add(testUser2);
            //context.Users.Add(testUser3);
            //context.Users.Add(testUser4);
            //context.Users.Add(testUser5);
            //context.Users.Add(testUser6);
            //context.Users.Add(testUser7);
            //#endregion
            //#region trees
            //var testTree1 = new Tree
            //{
            //    Name = "Kicun drzewo",
            //    IsPrivate = false,
            //    Nodes = new List<Node>()
            //};
            //var node1 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Dziadek",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 1,
            //    UserId = 6,
            //    TreeId = 1,
            //    Children = new List<Child>() { new Child {
            //        ChildPointer = 4
            //    }
            //    },
            //    FatherId = 0,
            //    MotherId = 0,
            //};
            //var node2 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Babcia",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 2,
            //    UserId = 7,
            //    TreeId = 1,
            //    Children = new List<Child>() { new Child {
            //        ChildPointer = 4
            //    }
            //    },
            //    FatherId = 0,
            //    MotherId = 0,
            //};
            //var node3 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Mama",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 3,
            //    UserId = 5,
            //    TreeId = 1,
            //    Children = new List<Child>() { 
            //        new Child 
            //        {
            //            ChildPointer = 1
            //        },
            //        new Child
            //        {
            //            ChildPointer = 2
            //        },
            //        new Child
            //        {
            //            ChildPointer = 3
            //        }
            //    },
            //    FatherId = 8,
            //    MotherId = 9,
            //};
            //var node4 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Ojciec",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 4,
            //    UserId = 4,
            //    TreeId = 1,
            //    Children = new List<Child>() {
            //        new Child
            //        {
            //            ChildPointer = 1
            //        },
            //        new Child
            //        {
            //            ChildPointer = 2
            //        },
            //        new Child
            //        {
            //            ChildPointer = 3
            //        }
            //    },
            //    FatherId = 1,
            //    MotherId = 2,
            //};
            //var node5 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Krzys",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 5,
            //    UserId = 1,
            //    TreeId = 1,
            //    Children = new List<Child>(),
            //    FatherId = 4,
            //    MotherId = 3,
            //};
            //var node6 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Siostra",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 6,
            //    UserId = 3,
            //    TreeId = 1,
            //    Children = new List<Child>(),
            //    FatherId = 4,
            //    MotherId = 3,
            //};
            //var node7 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Brat",
            //    Surname = "Kicun",
            //    PictureUrl = "",
            //    NodeId = 7,
            //    UserId = 2,
            //    TreeId = 1,
            //    Children = new List<Child>(),
            //    FatherId = 4,
            //    MotherId = 3,
            //};
            //var node8 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Dziadek2",
            //    Surname = "Niekicun",
            //    PictureUrl = "",
            //    NodeId = 8,
            //    UserId = 0,
            //    TreeId = 1,
            //    Children = new List<Child>() { new Child {
            //        ChildPointer = 3
            //    }
            //    },
            //    FatherId = 0,
            //    MotherId = 0,
            //};
            //var node9 = new Node
            //{
            //    Birthday = DateTime.Today,
            //    Description = "opis opis opis",
            //    Name = "Babcia2",
            //    Surname = "Niekicun",
            //    PictureUrl = "",
            //    NodeId = 9,
            //    UserId = 0,
            //    TreeId = 1,
            //    Children = new List<Child>() { new Child {
            //        ChildPointer = 3
            //    }
            //    },
            //    FatherId = 0,
            //    MotherId = 0,
            //};
            //testTree1.Nodes.Add(node1);
            //testTree1.Nodes.Add(node2);
            //testTree1.Nodes.Add(node3);
            //testTree1.Nodes.Add(node4);
            //testTree1.Nodes.Add(node5);
            //testTree1.Nodes.Add(node6);
            //testTree1.Nodes.Add(node7);
            //testTree1.Nodes.Add(node8);
            //testTree1.Nodes.Add(node9);
            //context.Trees.Add(testTree1);
            //#endregion
            //#region blog
            //var testPost1 = new Post
            //{
            //    CreationTime = DateTime.Now,
            //    UserId = 1,
            //    Title = "Tytuł testowy",
            //    Text = "Ala ma kota Marcina"
            //};
            //var testPost2 = new Post
            //{
            //    CreationTime = DateTime.Now,
            //    UserId = 1,
            //    Title = "Tytuł testowy 2",
            //    Text = "Marcin wielkim poetą był"
            //};
            //context.Posts.Add(testPost1);
            //context.Posts.Add(testPost2);
            //#endregion
            //context.SaveChanges();
        }
    }
}