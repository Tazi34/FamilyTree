using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FamilyTree.Entities;
using System.Text;
using System.IO;
using Microsoft.Extensions.Logging;
using FamilyTree.Services;

namespace FamilyTree.Gedcom
{
    public class GedcomWriter
    {
        private Tree tree;
        private List<Family> families = new List<Family>();
        private List<Individual> people = new List<Individual>();
        public GedcomWriter(Tree tree)
        {
            this.tree = tree;
            CreateIndividuals();
            CreateFamilies();
        }
        public Stream GetGedcom()
        {
            StringBuilder gedcom = new StringBuilder();
            GenerateHead(gedcom, tree.Name);
            foreach(Individual i in people)
                i.GenerateGedcom(gedcom);
            foreach(Family f in families)
                f.GenerateGedcom(gedcom);
            GenerateFooter(gedcom);
            //return gedcom.ToString();

            var stream = new MemoryStream();
            var writer = new StreamWriter(stream);
            writer.Write(gedcom.ToString());
            writer.Flush();
            stream.Position = 0;
            return stream;
        }
        private void GenerateHead(StringBuilder gedcom, string fileName)
        {
            gedcom.AppendLine("0 HEAD");
            gedcom.AppendLine("1 FILE " + fileName.Trim() + ".ged");
            gedcom.AppendLine("1 GEDC");
            gedcom.AppendLine("2 VERS 5.5.1");
            gedcom.AppendLine("2 FORM Lineage-Linked");
            gedcom.AppendLine("1 CHAR UTF-8");
            gedcom.AppendLine("1 LANG English");
            gedcom.AppendLine("1 DEST ANY");
            gedcom.AppendLine("1 PLAC");
            gedcom.AppendLine("2 FORM City, Zip code, State, Country");
        }
        private void GenerateFooter(StringBuilder gedcom)
        {
            gedcom.AppendLine("0 TRLR");
        }
        private void CreateIndividuals()
        {
            foreach(Node n in tree.Nodes)
            {
                people.Add(new Individual(n));
            }
        }
        private void CreateFamilies()
        {
            List<int> consideredIn1Stage = new List<int>();
            #region Stage1
            foreach (Individual i in people)
            {
                consideredIn1Stage.Add(i.Node.NodeId);
                foreach(NodeNodeMarriage partnerPointer in i.Node.Partners1)
                {
                    if(!consideredIn1Stage.Any(id => id == partnerPointer.Partner1.NodeId))
                    {
                        Individual partnerIndividual = people.FirstOrDefault(i => i.Node.NodeId == partnerPointer.Partner1.NodeId);
                        Family family = new Family();
                        family.AddParent(i);
                        family.AddParent(partnerIndividual);
                        i.AddSpouseFamily(family);
                        partnerIndividual.AddSpouseFamily(family);
                        families.Add(family);
                    }
                }
            }
            #endregion Stage1
            #region Stege2
            foreach(Individual i in people)
            {
                if(i.Node.Parents.Count == 2)
                {
                    var family = families.FirstOrDefault(f => f.HasParentsNodes(i.Node.Parents[0].ParentId, i.Node.Parents[1].ParentId));
                    if (family == null)
                    {
                        Individual parent1 = people.FirstOrDefault(p => p.Node.NodeId == i.Node.Parents[0].ParentId);
                        Individual parent2 = people.FirstOrDefault(p => p.Node.NodeId == i.Node.Parents[1].ParentId);
                        family = new Family();
                        family.AddParent(parent1);
                        family.AddParent(parent2);
                        parent1.AddSpouseFamily(family);
                        parent2.AddSpouseFamily(family);
                        families.Add(family);
                    }
                    family.AddChild(i);
                    i.AddChildFamily(family);
                }
                else if(i.Node.Parents.Count == 1)
                {
                    var family = families.FirstOrDefault(f => f.HasSingleParentNode(i.Node.Parents[0].ParentId));
                    if(family == null)
                    {
                        Individual parent = people.FirstOrDefault(p => p.Node.NodeId == i.Node.Parents[0].ParentId);
                        family = new Family();
                        family.AddParent(parent);
                        parent.AddSpouseFamily(family);
                        families.Add(family);
                    }
                    family.AddChild(i);
                    i.AddChildFamily(family);
                }
            }
            #endregion Stage2
        }
    }
}
