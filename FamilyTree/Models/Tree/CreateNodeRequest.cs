﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreateNodeRequest
    {
        public int UserId { get; set; }
        [Required]
        public int TreeId { get; set; }
        public DateTime Birthday { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PictureUrl { get; set; }
        public int FatherId { get; set; }
        public int MotherId { get; set; }
        public List<int> Children { get; set; }
    }
}