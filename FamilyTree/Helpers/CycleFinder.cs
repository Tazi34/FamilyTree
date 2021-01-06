using FamilyTree.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Helpers
{
    public class FamilyNodeCycle : NodeCycle
    {
        public FamilyNodeCycle(string id, int fatherId, int motherId, List<int> children) : base(id, fatherId, motherId, children)
        {

        }
        public override List<string> Neighbours
        {
            get
            {

                var neighbours = new List<string>();
                if (FatherId != 0)
                {
                    neighbours.Add(FatherId.ToString());
                }
                if (MotherId != 0)
                {
                    neighbours.Add(MotherId.ToString());
                }
                return neighbours.Concat(Children.Select(child => child.ToString())).ToList();
            }
        }

    }
    public class PersonNodeCycle : NodeCycle
    {
        public PersonNodeCycle(string id, int fatherId, int motherId, List<int> children, List<string> families, List<int> partners) : base(id, fatherId, motherId, children)
        {
            Families = families;
            Partners = partners;
        }

        public override List<string> Neighbours => Families;
        public List<int> Partners = new List<int>();
        public List<string> Families { get; set; } = new List<string>();

    }
    public abstract class NodeCycle
    {
        public string Id { get; set; }
        protected NodeCycle(string id, int fatherId, int motherId, List<int> children)
        {
            Id = id;
            FatherId = fatherId;
            MotherId = motherId;
            Children = children;
        }
        public List<int> Parents
        {
            get
            {
                var parents = new List<int>();
                if(FatherId != 0)
                {
                    parents.Add(FatherId);
                }
                if (MotherId != 0)
                {
                    parents.Add(MotherId);
                }
                return parents;
            }
        }
        public abstract List<string> Neighbours { get; }
        public int FatherId { get; set; }
        public int MotherId { get; set; }
        public List<int> Children { get; set; }

    }

    public static class NodeCycleMapper
    {
        public static PersonNodeCycle Map(this NodeResponse node)
        {
            return new PersonNodeCycle(node.NodeId.ToString(), node.FatherId, node.MotherId, new List<int>(node.Children), new List<string>(node.Families), new List<int>(node.Partners));
        }
        public static FamilyNodeCycle Map(this Family node)
        {
            return new FamilyNodeCycle(node.Id, node.FirstParentId ?? 0, node.SecondParentId ?? 0, new List<int>(node.Children));
        }
    }
    public class CycleFinder
    {
        public bool IsGraphCyclic(List<NodeCycle> nodes)
        {
            var visited = new Dictionary<string, bool>();
            var nodesMapping = new Dictionary<string, NodeCycle>();

            foreach (var node in nodes)
            {
                nodesMapping.Add(node.Id, node);
                visited.Add(node.Id, false);
            }

            for (var index = 0; index < nodes.Count; index++)
            {
                var node = nodes[index];
                if (!visited[node.Id])
                {
                    if (IsCyclicRec(node, nodesMapping, visited, "-1"))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool IsCyclicRec(NodeCycle node, Dictionary<string, NodeCycle> nodes, Dictionary<string, bool> visited, string parentId)
        {
            visited[node.Id] = true;
            var neighbours = node.Neighbours;

            for (var index = 0; index < neighbours.Count; index++)
            {
                var neighbourId = neighbours[index];
                if (!visited[neighbourId])
                {
                    if (IsCyclicRec(nodes[neighbourId], nodes, visited, node.Id))
                    {
                        return true;
                    }
                }
                else if (neighbourId != parentId)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
