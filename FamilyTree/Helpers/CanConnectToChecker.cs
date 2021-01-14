using FamilyTree.Entities;
using FamilyTree.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FamilyTree.Helpers
{
    public class CanConnectToChecker
    {
        public CheckPossibleConnectionResponse Check(DrawableTreeResponse tree, int nodeId, ConnectMode mode)
        {
            var cycleChecker = new CycleFinder();
            var node = tree.Nodes.FirstOrDefault(n => n.NodeId == nodeId);
            if (node == null)
            {
                return null;
            }
            switch (mode)
            {
                case ConnectMode.AsChild:
                case ConnectMode.ToFamily:
                    {
                        var familyCheck = Family(tree, node, cycleChecker);
                        var childCheck = SingleChild(tree, node, cycleChecker);

                        return new CheckPossibleConnectionResponse()
                        {
                            Families = familyCheck.Families.Concat(childCheck.Families).ToList(),
                            Nodes = familyCheck.Nodes.Concat(childCheck.Nodes).ToList()
                        };
                    }
                case ConnectMode.AsPartner:
                    {
                        return Partner(tree, node, cycleChecker);
                    }
                case ConnectMode.AsParent:
                    {
                        return Parent(tree, node, cycleChecker);
                    }

                default: throw new Exception("unsupported");
            }
        }

        private CheckPossibleConnectionResponse Family(DrawableTreeResponse tree, NodeResponse node, CycleFinder cycleChecker)
        {
            var connectableFamilies = new List<string>();
            if(node.FatherId != 0 && node.MotherId != 0)
            {
                return new CheckPossibleConnectionResponse();
            }
            foreach (var targetFamily in tree.Families)
            {
                if (targetFamily.Children.Contains(node.NodeId) ||
                    targetFamily.FirstParentId == node.NodeId ||
                    targetFamily.SecondParentId == node.NodeId)
                {
                    continue;
                }
             
                List<PersonNodeCycle> personNodes = tree.Nodes.Select(n => n.Map()).ToList();
                var familyNodes = tree.Families.Select(f => f.Map()).ToList();
                var nodes = personNodes.Cast<NodeCycle>().Concat(familyNodes.Cast<NodeCycle>()).ToList();
                var source = personNodes.Find(n => n.Id == node.NodeId.ToString());
                var family = familyNodes.Find(f => f.Id == targetFamily.Id);

                var sourceId = int.Parse(source.Id);

                //ma jednego rodzica sprawdz czy probuje polaczyc do partnera
                if(source.Parents.Count == 1)
                {
                    var parentId = source.Parents[0];
                    if (family.Parents.Contains(parentId))
                    {
                        var parent = tree.Nodes.Find(n => n.NodeId == parentId);
                        var otherParentInFamilyIsPartner = family.Parents.Any(parentInFamily => parent.Partners.Contains(parentInFamily));
                        //drugi z rodzicow w rodzinie jest partnerem naszego rodzica - git
                        if (otherParentInFamilyIsPartner)
                        {
                            connectableFamilies.Add(targetFamily.Id);
                            continue;
                        }                                           
                    }                  
                }

                family.Children.Add(sourceId);
                source.Families.Add(family.Id);
                var hasCycle = cycleChecker.IsGraphCyclic(nodes);
                if (!hasCycle)
                {
                    connectableFamilies.Add(targetFamily.Id);
                }
            }
            return new CheckPossibleConnectionResponse() { Families = connectableFamilies };

        }
        private CheckPossibleConnectionResponse Parent(DrawableTreeResponse tree, NodeResponse node, CycleFinder cycleChecker)
        {
            var connectableNodes = new List<int>();
            foreach (var targetNode in tree.Nodes)
            {
                if (node.NodeId == targetNode.NodeId
                 || node.FatherId == targetNode.NodeId
                 || node.MotherId == targetNode.NodeId
                 || node.Children.Contains(targetNode.NodeId)
                 || targetNode.FatherId != 0 && targetNode.MotherId != 0)
                {
                    continue;
                }

                List<PersonNodeCycle> personNodes = tree.Nodes.Select(n => n.Map()).ToList();
                var familyNodes = tree.Families.Select(f => f.Map()).ToList();
                var nodes = personNodes.Cast<NodeCycle>().Concat(familyNodes.Cast<NodeCycle>()).ToList();
                var source = personNodes.Find(n => n.Id == node.NodeId.ToString());

                var canConnectTo = false;
                //jesli ma rodzica podepnij go do rodziny 
                if (targetNode.FatherId != 0 || targetNode.MotherId != 0)
                {

                    var existingParentIsFather = targetNode.FatherId != 0;
                    var existingParentId = existingParentIsFather ? targetNode.FatherId : targetNode.MotherId;

                    //rodzic jest juz partnerem wiec git
                    if (source.Partners.Contains(existingParentId))
                    {
                        canConnectTo = true;
                    }
                    else
                    {
                        var familyToConnectTo = familyNodes.Find(f => f.Children.Contains(targetNode.NodeId));
                        source.Families.Add(familyToConnectTo.Id);
                        if (existingParentIsFather)
                        {
                            familyToConnectTo.MotherId = node.NodeId;
                        }
                        else
                        {
                            familyToConnectTo.FatherId = node.NodeId;
                        }
                        canConnectTo = !cycleChecker.IsGraphCyclic(nodes);
                    }
                }
                else
                {
                    canConnectTo = CheckAsSingleChild(targetNode.NodeId, cycleChecker, connectableNodes, int.Parse(source.Id), personNodes, nodes);
                }
                if (canConnectTo)
                {
                    connectableNodes.Add(targetNode.NodeId);
                }
            }
            return new CheckPossibleConnectionResponse() { Nodes = connectableNodes };

        }
        private CheckPossibleConnectionResponse Partner(DrawableTreeResponse tree, NodeResponse node, CycleFinder cycleChecker)
        {
            var connectableNodes = new List<int>();
            foreach (var targetNode in tree.Nodes)
            {
                if (node.NodeId == targetNode.NodeId
                    || node.FatherId == targetNode.NodeId
                    || node.MotherId == targetNode.NodeId
                    || node.Children.Contains(targetNode.NodeId))
                {
                    continue;
                }

                List<PersonNodeCycle> personNodes = tree.Nodes.Select(n => n.Map()).ToList();
                var familyNodes = tree.Families.Select(f => f.Map()).ToList();
                var nodes = personNodes.Cast<NodeCycle>().Concat(familyNodes.Cast<NodeCycle>()).ToList();

                var fakeFamily = new FamilyNodeCycle("fake", targetNode.NodeId, node.NodeId, new List<int> { });
                nodes.Add(fakeFamily);

                var partnerNode = personNodes.Find(n => n.Id == targetNode.NodeId.ToString());
                partnerNode.Families.Add(fakeFamily.Id);

                var sourceNode = personNodes.Find(n => n.Id == node.NodeId.ToString());
                sourceNode.Families.Add(fakeFamily.Id);
                var hasCycle = cycleChecker.IsGraphCyclic(nodes);
                if (!hasCycle)
                {
                    connectableNodes.Add(targetNode.NodeId);
                }

            }
            return new CheckPossibleConnectionResponse() { Nodes = connectableNodes };
        }
        private CheckPossibleConnectionResponse SingleChild(DrawableTreeResponse tree, NodeResponse node, CycleFinder cycleChecker)
        {
            if (node.FatherId != 0 && node.MotherId != 0)
            {
                return new CheckPossibleConnectionResponse();
            }

            var connectableNodes = new List<int>();
            foreach (var targetNode in tree.Nodes)
            {
                if (node.NodeId == targetNode.NodeId
                    || node.FatherId == targetNode.NodeId
                    || node.MotherId == targetNode.NodeId
                    || node.Children.Contains(targetNode.NodeId))
                {
                    continue;
                }

                List<PersonNodeCycle> personNodes = tree.Nodes.Select(n => n.Map()).ToList();
                var familyNodes = tree.Families.Select(f => f.Map()).ToList();
                var nodes = personNodes.Cast<NodeCycle>().Concat(familyNodes.Cast<NodeCycle>()).ToList();
                var childId = node.NodeId;
                var existingParentId = node.FatherId != 0 ? node.FatherId : node.MotherId;
                var targetNodeId = targetNode.NodeId;
                var target = personNodes.Find(n => n.Id == targetNodeId.ToString());

                if (node.FatherId != 0 || node.MotherId != 0)
                {
                    var family = familyNodes.First(f => f.Children.Contains(childId));
                    if (family.Parents.Count == 1 && targetNode.Partners.Contains(family.Parents[0]))
                    {
                        connectableNodes.Add(targetNode.NodeId);
                        continue;
                    }
                    //jesli rodzina ma wiele dzieci odepnij dziecko i utworz nowa rodzine 
                    if (family.Children.Count > 1)
                    {
                        family.Children.Remove(childId);
                        var fakeFamily = new FamilyNodeCycle("fake", int.Parse(target.Id), existingParentId, new List<int> { childId });
                        nodes.Add(fakeFamily);

                        var existingParent = personNodes.Find(n => n.Id == existingParentId.ToString());
                        existingParent.Families.Add(fakeFamily.Id);
                        existingParent.Children.Add(childId);

                        target.Families.Add(fakeFamily.Id);
                        target.Children.Add(childId);

                        var child = personNodes.Find(n => n.Id == childId.ToString());

                        child.Families.Add(fakeFamily.Id);
                        if (child.FatherId == existingParentId)
                        {
                            child.MotherId = targetNodeId;
                        }
                        else
                        {
                            child.FatherId = targetNodeId;
                        }
                    }
                    //jesli rodzina w ktorej jest dziecko i rodzic ma tylko jedno dziecko to przypisz rodzinie drugiego rodzica
                    else
                    {
                        var child = personNodes.Find(n => n.Id == childId.ToString());
                        if (child.FatherId == existingParentId)
                        {
                            family.MotherId = targetNodeId;
                            child.MotherId = targetNodeId;
                        }
                        else
                        {
                            child.FatherId = targetNodeId;
                            family.FatherId = targetNodeId;
                        }
                        target.Children.Add(childId);
                        target.Families.Add(family.Id);
                    }
                    if (!cycleChecker.IsGraphCyclic(nodes))
                    {
                        connectableNodes.Add(targetNode.NodeId);
                    }
                }
                else
                {
                    if (CheckAsSingleChild(node.NodeId, cycleChecker, connectableNodes, targetNode.NodeId, personNodes, nodes))
                    {
                        connectableNodes.Add(targetNode.NodeId);
                    }
                }
            }
            return new CheckPossibleConnectionResponse() { Nodes = connectableNodes };
        }


        private bool CheckAsSingleChild(int childId, CycleFinder cycleChecker, List<int> connectableNodes, int targetNodeId, List<PersonNodeCycle> personNodes, List<NodeCycle> nodes)
        {
            var fakeFamily = new FamilyNodeCycle("fake", targetNodeId, 0, new List<int> { childId });
            nodes.Add(fakeFamily);

            var parentNode = personNodes.Find(n => n.Id == targetNodeId.ToString());
            parentNode.Families.Add(fakeFamily.Id);
            parentNode.Children.Add(childId);

            var child = personNodes.Find(n => n.Id == childId.ToString());
            child.Families.Add(fakeFamily.Id);
            child.FatherId = targetNodeId;
            return !cycleChecker.IsGraphCyclic(nodes);

        }
    }
}
