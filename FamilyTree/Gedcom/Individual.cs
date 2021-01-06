﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;
using System.Text;

namespace FamilyTree.Gedcom
{
    public class Individual
    {
        static int idGeneratorValue = 1;
        public string Id { get; private set; }
        public string Name { get; private set; }
        public string Surname { get; private set; }
        public string Sex { get; private set; }
        public string Note { get; private set; }
        public Node Node { get; private set; }

        private Family famc;
        private List<Family> fams;
        public Individual(Node node)
        {
            Id = "I" + idGeneratorValue.ToString();
            idGeneratorValue++;
            Name = node.Name;
            Surname = node.Surname.ToUpper();
            Sex = node.Sex.Equals(Entities.Sex.Male) ? "M" : "F";
            Note = node.Description;
            Node = node;
        }
        public void AddChildFamily (Family family)
        {
            famc = family;
        }
        public void AddSpouseFamily (Family family)
        {
            fams.Add(family);
        }
        public void GenerateGedcom(StringBuilder gedcom)
        {
            gedcom.AppendLine("0 @" + Id + "@ INDI");
            gedcom.AppendLine("1 NAME " + Name + " /" + Surname.ToUpper() + "/");
            gedcom.AppendLine("2 GIVN " + Name);
            gedcom.AppendLine("2 SURN " + Surname.ToUpper());
            gedcom.AppendLine("1 SEX " + Sex);
            gedcom.AppendLine("1 NOTE " + Note);
            if (famc != null)
                gedcom.AppendLine("1 FAMC @" + famc.Id + "@");
            foreach (Family f in fams)
                gedcom.AppendLine("1 FAMC @" + f.Id + "@");
        }
    }
}