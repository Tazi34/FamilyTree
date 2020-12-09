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
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<PreviousSurname> PreviousSurnames { get; set; }
        public virtual DbSet<Tree> Trees { get; set; }
        public virtual DbSet<Node> Nodes { get; set; }
        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<NodeNode> NodeNode { get; set; }
        public virtual DbSet<NodeNodeMarriage> NodeNodeMarriage { get; set; }

        public DataContext() { }
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder model_builder)
        {
            model_builder.Entity<NodeNode>().HasKey(nn => new { nn.ParentId, nn.ChildId });
            model_builder.Entity<NodeNode>()
                .HasOne(bc => bc.Parent)
                .WithMany(b => b.Children)
                .HasForeignKey(bc => bc.ParentId);
            model_builder.Entity<NodeNode>()
                .HasOne(bc => bc.Child)
                .WithMany(c => c.Parents)
                .HasForeignKey(bc => bc.ChildId)
                .OnDelete(DeleteBehavior.Restrict);

            model_builder.Entity<NodeNodeMarriage>().HasKey(nnm => new { nnm.Partner1Id, nnm.Partner2Id});
            model_builder.Entity<NodeNodeMarriage>()
                .HasOne(nnm => nnm.Partner1)
                .WithMany(n => n.Partners2)
                .HasForeignKey(bc => bc.Partner1Id);
            model_builder.Entity<NodeNodeMarriage>()
                .HasOne(nnm => nnm.Partner2)
                .WithMany(n => n.Partners1)
                .HasForeignKey(nnm => nnm.Partner2Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
