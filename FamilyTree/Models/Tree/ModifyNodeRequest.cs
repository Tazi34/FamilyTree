﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FamilyTree.Models
{
    public class ModifyNodeRequest
    {
        [Required]
        public int NodeId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int TreeId { get; set; }
        [Required]
        public DateTime Birthday { get; set; }
        [Required(AllowEmptyStrings = true)]
        public string Description { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        public int FatherId { get; set; }
        [Required]
        public int MotherId { get; set; }
        [Required]
        public List<int> Children { get; set; }
        [Required]
        public List<int> Partners { get; set; }
        [Required]
        [RegularExpression(@"Male|Female|NotSure")]
        public string Sex { get; set; }
    }
}
