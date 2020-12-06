using System;
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
        public DbSet<Post> Posts { get; set; }
        public DbSet<NodeNode> NodeNode { get; set; }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder model_builder)
        {
            model_builder.Entity<NodeNode>().HasKey(bc => new { bc.ParentId, bc.ChildId });
            model_builder.Entity<NodeNode>()
                .HasOne(bc => bc.Parent)
                .WithMany(b => b.Children)
                .HasForeignKey(bc => bc.ParentId);
            model_builder.Entity<NodeNode>()
                .HasOne(bc => bc.Child)
                .WithMany(c => c.Parents)
                .HasForeignKey(bc => bc.ChildId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
