using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace FamilyTree.Gedcom
{
    public class Family
    {
        static int idGeneratorValue = 1;
        public string Id { get; private set; }
        private Individual father;
        private Individual mother;
        private List<Individual> children = new List<Individual>();
        public Family()
        {
            Id = "F" + idGeneratorValue.ToString();
            idGeneratorValue++;
        }
        public void AddChild(Individual child)
        {
            children.Add(child);
        }
        public void AddParent(Individual parent)
        {
            if (father == null && mother == null)
            {
                if (parent.Sex.Equals("M"))
                    father = parent;
                else
                    mother = parent;
            }
            else if (father == null)
                father = parent;
            else
                mother = parent;
        }
        public bool HasParentsNodes(int parent1Id, int parent2Id)
        {
            if (father == null || mother == null)
                return false;
            if (father.Node.NodeId == parent1Id && mother.Node.NodeId == parent2Id ||
                mother.Node.NodeId == parent1Id && father.Node.NodeId == parent2Id)
                return true;
            return false;
        }
        public bool HasSingleParentNode(int parentId)
        {
            if (father == null && mother != null && mother.Node.NodeId == parentId ||
                mother == null && father != null && father.Node.NodeId == parentId)
                return true;
            return false;
        }
        public void GenerateGedcom(StringBuilder gedcom)
        {
            gedcom.AppendLine("0 @" + Id + "@ FAM");
            if (mother != null)
                gedcom.AppendLine("1 WIFE @" + mother.Id + "@");
            if (father != null)
                gedcom.AppendLine("1 HUSB @" + father.Id + "@");
            foreach(Individual child in children)
            {
                gedcom.AppendLine("1 CHIL @" + child.Id + "@");
            }
        }
    }
}
