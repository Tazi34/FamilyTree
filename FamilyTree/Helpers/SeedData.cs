using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;

namespace FamilyTree.Helpers
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<DataContext>>()))
            {
                if (context.Users.Any())
                {
                    return;   // DB has been seeded
                }

                context.Users.AddRange(
                    new User
                    {
                        Name = "Krzys",
                        Surname = "Kicun",
                        Email = "abc@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "haslo123",
                        Role = Role.User,
                        PrevSurnames = new List<PreviousSurname>()
                    },
                    new User
                    {
                        Name = "Brat",
                        Surname = "Kicun",
                        Email = "brat@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "brat",
                        Role = Role.User
                    },
                    new User
                    {
                        Name = "Siostra",
                        Surname = "Kicun",
                        Email = "siostra@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "siostra",
                        Role = Role.User
                    },
                    new User
                    {
                        Name = "ojciec",
                        Surname = "Kicun",
                        Email = "ojciec@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "ojciec",
                        Role = Role.User
                    },
                    new User
                    {
                        Name = "mama",
                        Surname = "Kicun",
                        Email = "mama@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "mama",
                        Role = Role.User
                    },
                    new User
                    {
                        Name = "dziadek",
                        Surname = "Kicun",
                        Email = "dziadek@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "dziadek",
                        Role = Role.User
                    },
                    new User
                    {
                        Name = "babcia",
                        Surname = "Kicun",
                        Email = "babcia@kicunmail",
                        Birthday = DateTime.Today,
                        PasswordHash = "babcia",
                        Role = Role.User
                    }
                );

                context.SaveChanges();

                context.PreviousSurnames.AddRange(
                    new PreviousSurname
                    {
                        Surname = "PrevNazwisko1",
                        UserId = context.Users.Single(u => u.Email.Equals("abc@kicunmail")).UserId
                    },
                    new PreviousSurname
                    {
                        Surname = "PrevNazwisko2",
                        UserId = context.Users.Single(u => u.Email.Equals("abc@kicunmail")).UserId
                    }
                );
                context.Trees.Add(new Tree
                {
                    Name = "Kicun drzewo",
                    IsPrivate = false,
                    Nodes = new List<Node>()
                });

                context.SaveChanges();

                context.Nodes.AddRange(
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Dziadek",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("dziadek@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault(t => t.Name.Equals("Kicun drzewo")).TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = 0,
                    MotherId = 0,
                },
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Babcia",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("babcia@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault(t => t.Name.Equals("Kicun drzewo")).TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = 0,
                    MotherId = 0
                },
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Dziadek2",
                    Surname = "Niekicun",
                    PictureUrl = "",
                    UserId = 0,
                    TreeId = context.Trees.FirstOrDefault(t => t.Name.Equals("Kicun drzewo")).TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = 0,
                    MotherId = 0,
                },
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Babcia2",
                    Surname = "Niekicun",
                    PictureUrl = "",
                    UserId = 0,
                    TreeId = context.Trees.FirstOrDefault(t => t.Name.Equals("Kicun drzewo")).TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = 0,
                    MotherId = 0,
                }
                );
                context.SaveChanges();
                context.Nodes.AddRange(
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Mama",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("mama@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault().TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = context.Nodes.Single(n => n.Name.Equals("Dziadek2")).NodeId,
                    MotherId = context.Nodes.Single(n => n.Name.Equals("Babcia2")).NodeId
                },
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Ojciec",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("ojciec@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault().TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = context.Nodes.Single(n => n.Name.Equals("Dziadek")).NodeId,
                    MotherId = context.Nodes.Single(n => n.Name.Equals("Babcia")).NodeId
                }
                );
                context.SaveChanges();
                context.Nodes.AddRange(
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Krzys",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("abc@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault().TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = context.Nodes.Single(n => n.Name.Equals("Ojciec")).NodeId,
                    MotherId = context.Nodes.Single(n => n.Name.Equals("Mama")).NodeId
                },
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Siostra",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("siostra@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault().TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = context.Nodes.Single(n => n.Name.Equals("Ojciec")).NodeId,
                    MotherId = context.Nodes.Single(n => n.Name.Equals("Mama")).NodeId
                },
                new Node
                {
                    Birthday = DateTime.Today,
                    Description = "opis opis opis",
                    Name = "Brat",
                    Surname = "Kicun",
                    PictureUrl = "",
                    UserId = context.Users.Single(u => u.Email.Equals("brat@kicunmail")).UserId,
                    TreeId = context.Trees.FirstOrDefault().TreeId,
                    Children = new List<NodeNode>(),
                    Parents = new List<NodeNode>(),
                    FatherId = context.Nodes.Single(n => n.Name.Equals("Ojciec")).NodeId,
                    MotherId = context.Nodes.Single(n => n.Name.Equals("Mama")).NodeId
                }
                );

                context.SaveChanges();

                var dziadek = context.Nodes.SingleOrDefault(n => n.Name.Equals("Dziadek"));
                var babcia = context.Nodes.SingleOrDefault(n => n.Name.Equals("Babcia"));
                var mama = context.Nodes.SingleOrDefault(n => n.Name.Equals("Mama"));
                var ojciec = context.Nodes.SingleOrDefault(n => n.Name.Equals("Ojciec"));
                var krzys = context.Nodes.SingleOrDefault(n => n.Name.Equals("Krzys"));
                var siostra = context.Nodes.SingleOrDefault(n => n.Name.Equals("Siostra"));
                var brat = context.Nodes.SingleOrDefault(n => n.Name.Equals("Brat"));
                var dziadek2 = context.Nodes.SingleOrDefault(n => n.Name.Equals("Dziadek2"));
                var babcia2 = context.Nodes.SingleOrDefault(n => n.Name.Equals("Babcia2"));

                var rel1 = new NodeNode
                {
                    Child = ojciec,
                    ChildId = ojciec.NodeId,
                    Parent = dziadek,
                    ParentId = dziadek.NodeId
                };

                var rel2 = new NodeNode
                {
                    Child = ojciec,
                    ChildId = ojciec.NodeId,
                    Parent = babcia,
                    ParentId = babcia.NodeId
                };

                var rel3 = new NodeNode
                {
                    Child = krzys,
                    ChildId = krzys.NodeId,
                    Parent = mama,
                    ParentId = mama.NodeId
                };

                var rel4 = new NodeNode
                {
                    Child = siostra,
                    ChildId = siostra.NodeId,
                    Parent = mama,
                    ParentId = mama.NodeId
                };

                var rel5 = new NodeNode
                {
                    Child = brat,
                    ChildId = brat.NodeId,
                    Parent = mama,
                    ParentId = mama.NodeId
                };

                var rel6 = new NodeNode
                {
                    Child = krzys,
                    ChildId = krzys.NodeId,
                    Parent = ojciec,
                    ParentId = ojciec.NodeId
                };

                var rel7 = new NodeNode
                {
                    Child = siostra,
                    ChildId = siostra.NodeId,
                    Parent = ojciec,
                    ParentId = ojciec.NodeId
                };

                var rel8 = new NodeNode
                {
                    Child = brat,
                    ChildId = brat.NodeId,
                    Parent = ojciec,
                    ParentId = ojciec.NodeId
                };

                var rel9 = new NodeNode
                {
                    Child = mama,
                    ChildId = mama.NodeId,
                    Parent = dziadek2,
                    ParentId = dziadek2.NodeId
                };

                var rel10 = new NodeNode
                {
                    Child = mama,
                    ChildId = mama.NodeId,
                    Parent = babcia2,
                    ParentId = babcia2.NodeId
                };
                context.NodeNode.Add(rel1);
                context.NodeNode.Add(rel2);
                context.NodeNode.Add(rel3);
                context.NodeNode.Add(rel4);
                context.NodeNode.Add(rel5);
                context.NodeNode.Add(rel6);
                context.NodeNode.Add(rel7);
                context.NodeNode.Add(rel8);
                context.NodeNode.Add(rel9);
                context.NodeNode.Add(rel10);
                context.SaveChanges();

                context.Posts.AddRange(
                new Post
                {
                    CreationTime = DateTime.Now,
                    UserId = context.Users.Single(u => u.Email.Equals("abc@kicunmail")).UserId,
                    Title = "Tytuł testowy",
                    Text = "Ala ma kota Marcina"
                },
                new Post
                {
                    CreationTime = DateTime.Now,
                    UserId = context.Users.Single(u => u.Email.Equals("abc@kicunmail")).UserId,
                    Title = "Tytuł testowy 2",
                    Text = "Marcin wielkim poetą był"
                }
                );

                context.SaveChanges();
            }
        }
    }
}
