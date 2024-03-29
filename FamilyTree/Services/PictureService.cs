﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using FamilyTree.Helpers;
using Azure.Storage.Blobs;
using FamilyTree.Entities;
using FamilyTree.Models;
using System.IO;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace FamilyTree.Services
{
    public interface IPictureService
    {
        public Task<SetPictureResponse> SetProfilePicture(int userId, IFormFile picture);
        public Task<SetPictureResponse> SetBlogPictureAsync(IFormFile picture);
        public Task<SetPictureResponse> SetNodePicture(int userId, int nodeId, IFormFile picture);
        public Task<SetPictureResponse> DeleteNodePicture(int userId, int nodeId);
        public Task<SetPictureResponse> DeleteProfilePicture(int userId);
    }
    public class PictureService : IPictureService
    {
        private DataContext context;
        private BlobServiceClient blobService;
        private string blogContainerName;
        private string nodeContainerName;
        private string profileContainerName;
        public PictureService(DataContext dataContext, IOptions<AzureBlobSettings> azureBlobSettings)
        {
            context = dataContext;
            blobService = new BlobServiceClient(azureBlobSettings.Value.ConnectionString);
            blogContainerName = azureBlobSettings.Value.BlogContainer;
            nodeContainerName = azureBlobSettings.Value.NodeContainer;
            profileContainerName = azureBlobSettings.Value.ProfileContainer;
        }

        public async Task<SetPictureResponse> SetBlogPictureAsync(IFormFile picture)
        {
            if (!ValidateInput(picture))
                return null;
            string fileName = GetUniqueFilename(picture.FileName);
            BlobContainerClient container = blobService.GetBlobContainerClient(blogContainerName);
            BlobClient blob = container.GetBlobClient(fileName);
            Stream uploadFileStream = picture.OpenReadStream();
            await blob.UploadAsync(uploadFileStream, true);
            uploadFileStream.Close();
            return new SetPictureResponse
            {
                PictureUrl = blob.Uri.ToString()
            };
        }

        public async Task<SetPictureResponse> SetNodePicture(int userId, int nodeId, IFormFile picture)
        {
            var node = await context.Nodes.FirstOrDefaultAsync(n => n.NodeId == nodeId);
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            var tree = await context.Trees.Include(x => x.Nodes).FirstOrDefaultAsync(t => t.TreeId == (node == null ? -1 : node.TreeId));
            if (!ValidateInput(userId, node, tree, picture))
                return null;
            if (node.PictureUrl != null && node.PictureUrl != "")
                await DeletePicture(node);
            string fileName = GetUniqueFilename(nodeId, picture.FileName);
            BlobContainerClient container = blobService.GetBlobContainerClient(nodeContainerName);
            BlobClient blob = container.GetBlobClient(fileName);
            Stream uploadFileStream = picture.OpenReadStream();
            await blob.UploadAsync(ResizePicture(uploadFileStream), true);
            uploadFileStream.Close();
            node.PictureUrl = blob.Uri.ToString();
            context.Nodes.Update(node);
            await context.SaveChangesAsync();
            return new SetPictureResponse
            {
                PictureUrl = blob.Uri.ToString()
            };
        }

        private bool ValidateInput(int userId, Node node, Tree tree, IFormFile picture)
        {
            if (picture == null || !picture.ContentType.StartsWith("image"))
                return false;
            else
                return ValidateInput(userId, node, tree);
        }
        private bool ValidateInput(int userId, Node node, Tree tree)
        {
            if (node == null || tree == null)
                return false;
            if (node.UserId == userId)
                return true;
            if (node.UserId != 0)
                return false;
            bool userInTree = false;
            foreach (Node n in tree.Nodes)
            {
                if (n.UserId == userId)
                    userInTree = true;
            }
            return userInTree;
        }

        public async Task<SetPictureResponse> SetProfilePicture(int userId, IFormFile picture)
        {
            var user = context.Users.SingleOrDefault(u => u.UserId == userId);
            if (!ValidateInput(user, picture))
                return null;
            string oldPictureUrl = user.PictureUrl;
            if (user.PictureUrl != null && user.PictureUrl != "")
                await DeletePicture(user);
            string fileName = GetUniqueFilename(userId, picture.FileName);
            BlobContainerClient container = blobService.GetBlobContainerClient(profileContainerName);
            BlobClient blob = container.GetBlobClient(fileName);
            Stream uploadFileStream = picture.OpenReadStream();
            await blob.UploadAsync(ResizePicture(uploadFileStream), true);
            uploadFileStream.Close();
            user.PictureUrl = blob.Uri.ToString();
            context.Users.Update(user);
            await context.SaveChangesAsync();
            await UpdateNodesPictures(user, oldPictureUrl);
            return new SetPictureResponse
            {
                PictureUrl = blob.Uri.ToString()
            };
        }

        private async Task UpdateNodesPictures(User user, string oldPictureUrl)
        {
            var nodes = await context.Nodes.Where(n => n.UserId == user.UserId && n.PictureUrl.Equals(oldPictureUrl)).ToListAsync();
            foreach(Node n in nodes)
            {
                n.PictureUrl = user.PictureUrl;
                context.Nodes.Update(n);
            }
            await context.SaveChangesAsync();
        }

        private async Task DeletePicture(User user)
        {
            var container = blobService.GetBlobContainerClient(profileContainerName);
            var blob = container.GetBlobClient(user.PictureUrl.Substring(container.Uri.ToString().Length + 1));
            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
            user.PictureUrl = "";
            context.Users.Update(user);
            await context.SaveChangesAsync();
        }
        private async Task DeletePicture(Node node)
        {
            var container = blobService.GetBlobContainerClient(nodeContainerName);
            var blob = container.GetBlobClient(node.PictureUrl.Substring(container.Uri.ToString().Length + 1));
            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
            node.PictureUrl = "";
            context.Nodes.Update(node);
            await context.SaveChangesAsync();
        }

        private string GetUniqueFilename(int id, string userProvidedFileName)
        {
            return id.ToString() + ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds().ToString() + userProvidedFileName;
        }
        private string GetUniqueFilename(string userProvidedFileName)
        {
            return ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds().ToString() + userProvidedFileName;
        }

        private bool ValidateInput(User user, IFormFile picture)
        {
            if (user == null || picture == null || !picture.ContentType.StartsWith("image"))
                return false;
            return true;
        }
        private bool ValidateInput(IFormFile picture)
        {
            if (picture == null || !picture.ContentType.StartsWith("image"))
                return false;
            return true;
        }

        public async Task<SetPictureResponse> DeleteProfilePicture(int userId)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return null;
            string oldPictureUrl = user.PictureUrl;
            if (user.PictureUrl != null && user.PictureUrl != "")
                await DeletePicture(user);
            await UpdateNodesPictures(user, oldPictureUrl);
            return new SetPictureResponse
            {
                PictureUrl = user.PictureUrl
            };
        }

        public async Task<SetPictureResponse> DeleteNodePicture(int userId, int nodeId)
        {
            var node = await context.Nodes.FirstOrDefaultAsync(n => n.NodeId == nodeId);
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            var tree = await context.Trees.Include(x => x.Nodes).FirstOrDefaultAsync(t => t.TreeId == (node == null ? -1 : node.TreeId));
            if (!ValidateInput(userId, node, tree))
                return null;
            if (node.PictureUrl != null && node.PictureUrl != "")
                await DeletePicture(node);
            return new SetPictureResponse
            {
                PictureUrl = node.PictureUrl
            };
        }
        private Stream ResizePicture(Stream pictureStream)
        {
            Image image = Image.Load(pictureStream);
            image.Mutate(x => x.Resize(200, 200));
            var resizedImageStream = new MemoryStream();
            image.Save(resizedImageStream, new JpegEncoder());
            resizedImageStream.Seek(0, SeekOrigin.Begin);
            return resizedImageStream;
        }
    }
}