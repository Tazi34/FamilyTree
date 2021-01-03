using System;
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

namespace FamilyTree.Services
{
    public interface IPictureService
    {
        public Task<SetPictureResponse> SetProfilePicture(int userId, IFormFile picture);
        public Task<SetPictureResponse> SetBlogPictureAsync(IFormFile picture);
        public Task<SetPictureResponse> SetNodePicture(int userId, int nodeId, IFormFile picture);
    }
    public class PictureService : IPictureService
    {
        private DataContext context;
        private BlobServiceClient blobService;
        public PictureService(DataContext dataContext, IOptions<AzureBlobSettings> azureBlobSettings)
        {
            context = dataContext;
            blobService = new BlobServiceClient(azureBlobSettings.Value.ConnectionString);
        }

        public async Task<SetPictureResponse> SetBlogPictureAsync(IFormFile picture)
        {
            if (!ValidateInput(picture))
                return null;
            string fileName = GetUniqueFilename(picture.FileName);
            BlobContainerClient container = blobService.GetBlobContainerClient("blog");
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
            var node = context.Nodes.SingleOrDefault(n => n.NodeId == nodeId);
            var user = context.Users.SingleOrDefault(u => u.UserId == userId);
            var tree = context.Trees.Include(x => x.Nodes).SingleOrDefault(t => t.TreeId == (node == null ? -1 : node.TreeId));
            if (!ValidateInput(userId, node, tree, picture))
                return null;
            if (node.PictureUrl != null && node.PictureUrl != "")
                await DeletePicture(node);
            string fileName = GetUniqueFilename(nodeId, picture.FileName);
            BlobContainerClient container = blobService.GetBlobContainerClient("node");
            BlobClient blob = container.GetBlobClient(fileName);
            Stream uploadFileStream = picture.OpenReadStream();
            await blob.UploadAsync(uploadFileStream, true);
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
            if (node == null || tree == null || picture == null || !picture.ContentType.StartsWith("image"))
                return false;
            if (node.UserId == userId)
                return true;
            bool userInTree = false;
            foreach(Node n in tree.Nodes)
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
            if (user.PictureUrl != null && user.PictureUrl != "")
                await DeletePicture(user);
            string fileName = GetUniqueFilename(userId, picture.FileName);
            BlobContainerClient container = blobService.GetBlobContainerClient("profile");
            BlobClient blob = container.GetBlobClient(fileName);
            Stream uploadFileStream = picture.OpenReadStream();
            await blob.UploadAsync(uploadFileStream, true);
            uploadFileStream.Close();
            user.PictureUrl = blob.Uri.ToString();
            context.Users.Update(user);
            await context.SaveChangesAsync();
            return new SetPictureResponse
            {
                PictureUrl = blob.Uri.ToString()
            };
        }

        private async Task DeletePicture(User user)
        {
            var container = blobService.GetBlobContainerClient("profile");
            var blob = container.GetBlobClient(user.PictureUrl.Substring(container.Uri.ToString().Length + 1));
            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
            user.PictureUrl = null;
        }
        private async Task DeletePicture(Node node)
        {
            var container = blobService.GetBlobContainerClient("node");
            var blob = container.GetBlobClient(node.PictureUrl.Substring(container.Uri.ToString().Length + 1));
            await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
            node.PictureUrl = null;
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
    }
}
