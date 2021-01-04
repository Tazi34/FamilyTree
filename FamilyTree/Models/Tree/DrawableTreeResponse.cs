using FamilyTree.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FamilyTree.Models
{
    public class DrawableTreeResponse : TreeResponse
    {
        public List<Link> Links { get; set; }
        public List<Family> Families { get; set; }
        public DrawableTreeResponse(Tree tree, User user) : base(tree, user)
        {
            var families = new Dictionary<(int firstParentId, int secondParentId), Family>();
            var links = new List<Link>();

            foreach (var node in Nodes)
            {
                //jesli ma rodzicow to bedzie/jest rodzina
                if (node.FatherId != 0 || node.MotherId != 0)
                {

                    var key = (node.FatherId, node.MotherId);
                    var family = TryGetFamily(families, key);

                    //nie ma rodziny utworz nowa z wezlem jako dziecko
                    if (family == null)
                    {
                        families.Add(key, new Family()
                        {
                            FirstParentId = node.FatherId,
                            SecondParentId = node.MotherId,
                            Children = new List<int> { node.NodeId }
                        });
                    }
                    else
                    {
                        family.Children.Add(node.NodeId);
                    }
                }
                //jesli nie maja dzieci to trzeba dodac oddzielnie
                foreach (var partner in node.Partners)
                {
                    var key = (node.NodeId, partner);
                    var family = TryGetFamily(families, key);
                    if (family == null)
                    {
                        families.Add(key, new Family() { FirstParentId = node.NodeId, SecondParentId = partner, Children = new List<int>() });
                    }
                }
            }

            foreach (var family in families.Values)
            {
                var idBuilder = new StringBuilder("f");
                if (family.FirstParentId != 0)
                {
                    idBuilder.Append(family.FirstParentId);
                    idBuilder.Append("_");
                }
                if (family.SecondParentId != 0)
                {
                    idBuilder.Append(family.SecondParentId);
                    idBuilder.Append("_");
                }
                idBuilder.Append("__");
                var childrenIdsSorted = family.Children.OrderBy(a => a).ToArray();
                foreach (var childId in childrenIdsSorted)
                {
                    idBuilder.Append(childId);
                    idBuilder.Append("_");
                }
                family.Id = idBuilder.ToString();
            }

            //dodaj polaczenia i przypisz rodziny do czlonkow
            foreach (var family in families.Values)
            {
                if (family.FirstParentId != 0)
                {
                    links.Add(new Link(family.FirstParentId.Value.ToString(), family.Id));
                }
                if (family.SecondParentId != 0)
                {
                    links.Add(new Link(family.SecondParentId.Value.ToString(), family.Id));
                }
                foreach (var child in family.Children)
                {
                    links.Add(new Link(family.Id, child.ToString()));
                }

                NodeResponse firstParent = null;
                NodeResponse secondParent = null;

                //jak sa rodzice to dodaj im wskazanie na rodzine
                if (family.FirstParentId != 0)
                {
                    firstParent = Nodes.First(node => node.NodeId == family.FirstParentId);
                    firstParent?.Families.Add(family.Id);
                }
                if (family.SecondParentId != 0)
                {
                    secondParent = Nodes.First(node => node.NodeId == family.SecondParentId);
                    secondParent?.Families.Add(family.Id);
                }

                if (firstParent != null && secondParent != null)
                {
                    family.X =
   Math.Min(firstParent.X, secondParent.X) +
   Math.Abs(firstParent.X - secondParent.X) / 2;
                    family.Y =
                      Math.Min(firstParent.Y, secondParent.Y) +
                      Math.Abs(firstParent.Y - secondParent.Y) / 2;

                }
                else
                {
                    var existingParent = firstParent ?? secondParent;
                    family.X = existingParent.X;
                    family.Y = existingParent.Y;
                }

                //przypisz dzieciom rodziny 
                foreach (var childId in family.Children)
                {
                    //TODO przerobic jak bedzie czas i problem z wydajnoscia na slownik albo calkiem inaczej 
                    var child = Nodes.FirstOrDefault(node => node.NodeId == childId);
                    child.Families.Add(family.Id);
                }
            }
            Links = links;
            Families = families.Values.ToList();
        }

       
        private Family TryGetFamily(Dictionary<(int, int), Family> families, (int firstId, int secondId) key)
        {
            var (firstId, secondId) = key;

            Family existingFamily = null;
            families.TryGetValue((firstId, secondId), out existingFamily);
            if (existingFamily == null)
            {
                families.TryGetValue((secondId, firstId), out existingFamily);
            }
            return existingFamily;
        }
    }
}

