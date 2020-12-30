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

namespace FamilyTree.Services
{
    public interface IPictureService
    {
        public Task<SetPictureResponse> SetProfilePicture(int userId, IFormFile picture);
    }
    public class PictureService : IPictureService
    {
        private DataContext context;
        private BlobServiceClient blobService;
        public PictureService(DataContext dataContext)
        {
            string connectionString = "DefaultEndpointsProtocol=https;AccountName=familytreeimagesaccount;AccountKey=TKCEC7Gcqkh1U6ZWc0lSXhAS7W0PtEGdG+Kj6XhLDphaMtkcLnRf3dPEU0UxeDfYHlHCK/hx3uOoAzp85FRNQA==;EndpointSuffix=core.windows.net";
            context = dataContext;
            blobService = new BlobServiceClient(connectionString);
        }
        public async Task<SetPictureResponse> SetProfilePicture(int userId, IFormFile picture)
        {
            var user = context.Users.SingleOrDefault(u => u.UserId == userId);
            if (!ValidateInput(user, picture))
                return null;
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

        private string GetUniqueFilename(int userId, string userProvidedFileName)
        {
            return userId.ToString() + ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds().ToString() + userProvidedFileName;
        }

        private bool ValidateInput(User user, IFormFile picture)
        {
            if (user == null || picture == null || !picture.ContentType.StartsWith("image"))
                return false;
            return true;
        }
    }
}
