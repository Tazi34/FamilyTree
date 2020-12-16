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
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<Chat> Chats { get; set; }

        public DataContext() { }
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NodeNode>().HasKey(nn => new { nn.ParentId, nn.ChildId });
            modelBuilder.Entity<NodeNode>()
                .HasOne(bc => bc.Parent)
                .WithMany(b => b.Children)
                .HasForeignKey(bc => bc.ParentId);
            modelBuilder.Entity<NodeNode>()
                .HasOne(bc => bc.Child)
                .WithMany(c => c.Parents)
                .HasForeignKey(bc => bc.ChildId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NodeNodeMarriage>().HasKey(nnm => new { nnm.Partner1Id, nnm.Partner2Id});
            modelBuilder.Entity<NodeNodeMarriage>()
                .HasOne(nnm => nnm.Partner1)
                .WithMany(n => n.Partners2)
                .HasForeignKey(bc => bc.Partner1Id);
            modelBuilder.Entity<NodeNodeMarriage>()
                .HasOne(nnm => nnm.Partner2)
                .WithMany(n => n.Partners1)
                .HasForeignKey(nnm => nnm.Partner2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Chat>().HasIndex(m => new {m.User1Id, m.User2Id }).IsUnique();
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.User1)
                .WithMany(u => u.Chats2)
                .HasForeignKey(c => c.User1Id);

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.User2)
                .WithMany(u => u.Chats1)
                .HasForeignKey(c => c.User2Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
