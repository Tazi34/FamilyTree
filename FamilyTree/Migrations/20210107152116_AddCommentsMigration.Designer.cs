﻿// <auto-generated />
using System;
using FamilyTree.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FamilyTree.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20210107152116_AddCommentsMigration")]
    partial class AddCommentsMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("FamilyTree.Entities.Chat", b =>
                {
                    b.Property<int>("ChatId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<DateTime>("LastMessageTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("User1Id")
                        .HasColumnType("int");

                    b.Property<int>("User2Id")
                        .HasColumnType("int");

                    b.HasKey("ChatId");

                    b.HasIndex("User2Id");

                    b.HasIndex("User1Id", "User2Id")
                        .IsUnique();

                    b.ToTable("Chats");
                });

            modelBuilder.Entity("FamilyTree.Entities.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<int?>("PostId")
                        .HasColumnType("int");

                    b.Property<string>("Text")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Time")
                        .HasColumnType("datetime2");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("CommentId");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("FamilyTree.Entities.Invitation", b =>
                {
                    b.Property<int>("InvitationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<int>("AskedUserId")
                        .HasColumnType("int");

                    b.Property<int>("HostId")
                        .HasColumnType("int");

                    b.Property<int>("TreeId")
                        .HasColumnType("int");

                    b.HasKey("InvitationId");

                    b.HasIndex("AskedUserId");

                    b.HasIndex("HostId");

                    b.HasIndex("TreeId");

                    b.ToTable("Invitations");
                });

            modelBuilder.Entity("FamilyTree.Entities.Message", b =>
                {
                    b.Property<int>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<int>("ChatId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("FromId")
                        .HasColumnType("int");

                    b.Property<bool>("Sent")
                        .HasColumnType("bit");

                    b.Property<string>("Text")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ToId")
                        .HasColumnType("int");

                    b.HasKey("MessageId");

                    b.HasIndex("ChatId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("FamilyTree.Entities.Node", b =>
                {
                    b.Property<int>("NodeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<DateTime>("Birthday")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("FatherId")
                        .HasColumnType("int");

                    b.Property<int>("MotherId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PictureUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Sex")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TreeId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("X")
                        .HasColumnType("int");

                    b.Property<int>("Y")
                        .HasColumnType("int");

                    b.HasKey("NodeId");

                    b.HasIndex("TreeId");

                    b.ToTable("Nodes");
                });

            modelBuilder.Entity("FamilyTree.Entities.NodeNode", b =>
                {
                    b.Property<int>("ParentId")
                        .HasColumnType("int");

                    b.Property<int>("ChildId")
                        .HasColumnType("int");

                    b.HasKey("ParentId", "ChildId");

                    b.HasIndex("ChildId");

                    b.ToTable("NodeNode");
                });

            modelBuilder.Entity("FamilyTree.Entities.NodeNodeMarriage", b =>
                {
                    b.Property<int>("Partner1Id")
                        .HasColumnType("int");

                    b.Property<int>("Partner2Id")
                        .HasColumnType("int");

                    b.HasKey("Partner1Id", "Partner2Id");

                    b.HasIndex("Partner2Id");

                    b.ToTable("NodeNodeMarriage");
                });

            modelBuilder.Entity("FamilyTree.Entities.Post", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<DateTime>("CreationTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("PictureUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Text")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("PostId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("FamilyTree.Entities.PreviousSurname", b =>
                {
                    b.Property<int>("PreviousSurnameId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("PreviousSurnameId");

                    b.HasIndex("UserId");

                    b.ToTable("PreviousSurnames");
                });

            modelBuilder.Entity("FamilyTree.Entities.Tree", b =>
                {
                    b.Property<int>("TreeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TreeId");

                    b.ToTable("Trees");
                });

            modelBuilder.Entity("FamilyTree.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<DateTime>("Birthday")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PictureUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Role")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Salt")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Sex")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("FamilyTree.Entities.Chat", b =>
                {
                    b.HasOne("FamilyTree.Entities.User", "User1")
                        .WithMany("Chats2")
                        .HasForeignKey("User1Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FamilyTree.Entities.User", "User2")
                        .WithMany("Chats1")
                        .HasForeignKey("User2Id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User1");

                    b.Navigation("User2");
                });

            modelBuilder.Entity("FamilyTree.Entities.Comment", b =>
                {
                    b.HasOne("FamilyTree.Entities.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId");

                    b.HasOne("FamilyTree.Entities.User", "User")
                        .WithMany("UserComments")
                        .HasForeignKey("UserId");

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("FamilyTree.Entities.Invitation", b =>
                {
                    b.HasOne("FamilyTree.Entities.User", "AskedUser")
                        .WithMany("HostedInvitations")
                        .HasForeignKey("AskedUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FamilyTree.Entities.User", "Host")
                        .WithMany("AskedInvitations")
                        .HasForeignKey("HostId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("FamilyTree.Entities.Tree", "Tree")
                        .WithMany("Invitations")
                        .HasForeignKey("TreeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AskedUser");

                    b.Navigation("Host");

                    b.Navigation("Tree");
                });

            modelBuilder.Entity("FamilyTree.Entities.Message", b =>
                {
                    b.HasOne("FamilyTree.Entities.Chat", "Chat")
                        .WithMany("Messages")
                        .HasForeignKey("ChatId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Chat");
                });

            modelBuilder.Entity("FamilyTree.Entities.Node", b =>
                {
                    b.HasOne("FamilyTree.Entities.Tree", null)
                        .WithMany("Nodes")
                        .HasForeignKey("TreeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("FamilyTree.Entities.NodeNode", b =>
                {
                    b.HasOne("FamilyTree.Entities.Node", "Child")
                        .WithMany("Parents")
                        .HasForeignKey("ChildId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("FamilyTree.Entities.Node", "Parent")
                        .WithMany("Children")
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Child");

                    b.Navigation("Parent");
                });

            modelBuilder.Entity("FamilyTree.Entities.NodeNodeMarriage", b =>
                {
                    b.HasOne("FamilyTree.Entities.Node", "Partner1")
                        .WithMany("Partners2")
                        .HasForeignKey("Partner1Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FamilyTree.Entities.Node", "Partner2")
                        .WithMany("Partners1")
                        .HasForeignKey("Partner2Id")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Partner1");

                    b.Navigation("Partner2");
                });

            modelBuilder.Entity("FamilyTree.Entities.PreviousSurname", b =>
                {
                    b.HasOne("FamilyTree.Entities.User", null)
                        .WithMany("PrevSurnames")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("FamilyTree.Entities.Chat", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("FamilyTree.Entities.Node", b =>
                {
                    b.Navigation("Children");

                    b.Navigation("Parents");

                    b.Navigation("Partners1");

                    b.Navigation("Partners2");
                });

            modelBuilder.Entity("FamilyTree.Entities.Post", b =>
                {
                    b.Navigation("Comments");
                });

            modelBuilder.Entity("FamilyTree.Entities.Tree", b =>
                {
                    b.Navigation("Invitations");

                    b.Navigation("Nodes");
                });

            modelBuilder.Entity("FamilyTree.Entities.User", b =>
                {
                    b.Navigation("AskedInvitations");

                    b.Navigation("Chats1");

                    b.Navigation("Chats2");

                    b.Navigation("HostedInvitations");

                    b.Navigation("PrevSurnames");

                    b.Navigation("UserComments");
                });
#pragma warning restore 612, 618
        }
    }
}