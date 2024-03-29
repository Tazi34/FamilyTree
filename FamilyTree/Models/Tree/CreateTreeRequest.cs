﻿using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class CreateTreeRequest
    {
        [Required]
        public string TreeName { get; set; }
        [Required]
        public bool IsPrivate { get; set; }
    }
}
