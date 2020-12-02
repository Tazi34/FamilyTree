﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FamilyTree.Entities;

namespace FamilyTree.Helpers
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<PreviousSurname> PreviousSurnames { get; set; }
        public DbSet<Tree> Trees { get; set; }
        public DbSet<Node> Nodes { get; set; }
        public DbSet<Child> Children { get; set; }
        public DbSet<Post> Posts { get; set; }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder model_builder)
        {
            //model_builder.Entity<User>(entity => {
            //    entity.HasIndex(e => e.Email).IsUnique(true);
            //});
            //model_builder.Entity<Child>(entity => {
            //    entity
            //    .HasNoKey();
            //});
        }
    }
}