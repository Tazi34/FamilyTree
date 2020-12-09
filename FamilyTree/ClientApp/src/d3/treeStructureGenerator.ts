import { WorkPersonNode } from "./../model/TreeStructureInterfaces";
import { EntityState } from "@reduxjs/toolkit";
import { mapCollectionToEntity } from "../helpers/helpers";
import {
  Family,
  Person,
  TreeStructure,
} from "../model/TreeStructureInterfaces";
import { peopleAdapter } from "../components/tree/treeReducer";

export const GetTreeStructures = (
  people: EntityState<Person>
): TreeStructure[] => {
  var allPeopleEntities = people.ids.map(
    (id) => people.entities[id]
  ) as Person[];

  if (allPeopleEntities.length == 0) {
    return [
      {
        links: [["lfakeNode1_fakeNode2"]],
        people: {
          ids: [],
          entities: {},
        },
        families: [],
      },
    ];
  }
  const personNodes = allPeopleEntities.map((p) => personToNode(p));
  var labeledNodes = LabelGraphs(personNodes);

  for (var i = 0; i < allPeopleEntities.length; i++) {
    allPeopleEntities[i] = Object.assign({}, allPeopleEntities[i]);
    allPeopleEntities[i].graph = labeledNodes[i].graph;
  }

  var graphsDict: Dictionary = [];

  allPeopleEntities.forEach((p: any) => {
    const graphIndex = p.graph as number;
    if (!graphsDict[graphIndex]) {
      graphsDict[graphIndex] = [];
    }
    graphsDict[graphIndex].push(p);
  });

  const treeStructures: TreeStructure[] = [];
  for (const graph in graphsDict) {
    if (Object.prototype.hasOwnProperty.call(graphsDict, graph)) {
      treeStructures.push(GetTreeStructure(graphsDict[graph]));
    }
  }
  return treeStructures;
};
export const GetTreeStructure = (people: Person[]): TreeStructure => {
  var familyIdCounter = 0;
  var families: Family[] = [];
  var links: string[][] = [];
  var family: Family | undefined;
  people.forEach((person) => {
    const { id } = person;

    family = families.find(
      (family) =>
        (family.firstParent == person.firstParent &&
          family.secondParent == person.secondParent) ||
        (family.secondParent == person.firstParent &&
          family.firstParent == person.secondParent)
    );
    if (family) {
      family.children.push(id);
    } else {
      if (person.firstParent || person.secondParent) {
        family = {
          firstParent: person.firstParent,
          secondParent: person.secondParent,
          children: [id],
          id: person.graph + "u" + familyIdCounter++,
        };

        families.push(family);
      }
    }
    if (family) {
      person.families = Object.assign([], person.families);
      person.families!.push(family!.id);
    }
  });
  families.forEach((family) => {
    if (family.firstParent) {
      links.push([(family.firstParent as number).toString(), family.id]);
    }
    if (family.secondParent) {
      links.push([(family.secondParent as number).toString(), family.id]);
    }
    family.children.forEach((child) =>
      links.push([family.id, child.toString()])
    );
  });

  //uzupelnij rodziny o rodziny bez dzieci
  people.forEach((p) => {
    if (p.partners.length > 0) {
      p.partners.forEach((partner) => {
        const foundFamily = families.find(
          (family) =>
            (family.firstParent == p.id && family.secondParent == partner) ||
            (family.secondParent == p.id && family.firstParent == partner)
        );
        if (!foundFamily) {
          const newFamily: Family = {
            firstParent: p.id,
            secondParent: partner,
            children: [],
            id: "u" + familyIdCounter++,
          };

          families.push(newFamily);
        }
      });
    }
  });

  const peopleCount = people.length;
  if (peopleCount == 1) {
    var person = people[0];

    links = [[person.id.toString(), "fakeNode1"]];
  } else if (peopleCount == 0) {
    links = [["fakeNode1", "fakeNode2"]];
  }

  const personNodes = people.map((p) => personToNode(p));
  //const isAP = AP(personNodes);

  return {
    families,
    people: mapCollectionToEntity(people),
    links,
  };
};
// export const generateTreeStructure = (people: Person[]): TreeStructure => {
//   var familyIdCounter = 0;
//   var families: Family[] = [];
//   var links: string[][] = [];

//   people.forEach((p) => {
//     p.children = [];
//     p.partners = [];
//     p.information.name = names[p.id];
//     p.information.surname = surnames[p.id];
//   });

//   people.forEach((person) => {
//     const { id } = person;

//     var firstParent: Person | undefined;
//     var secondParent: Person | undefined;
//     if (person.firstParent) {
//       firstParent = people.find((a) => a.id == person.firstParent);
//       if (!firstParent) {
//         person.firstParent = undefined;
//       } else {
//         firstParent!.children.push(id);
//       }
//     }

//     if (person.secondParent) {
//       secondParent = people.find((a) => a.id == person.secondParent);
//       if (!secondParent) {
//         person.secondParent = undefined;
//       }
//     }

//     if (firstParent && secondParent) {
//       if (!firstParent!.partners.includes(secondParent)) {
//         firstParent!.partners.push(secondParent);
//       }
//       if (!secondParent!.partners.includes(firstParent)) {
//         secondParent!.partners.push(firstParent);
//       }
//     }

//     const foundFamily = families.find(
//       (family) =>
//         (family.firstParent == person.firstParent &&
//           family.secondParent == person.secondParent) ||
//         (family.secondParent == person.firstParent &&
//           family.firstParent == person.secondParent)
//     );
//     if (foundFamily) {
//       foundFamily.children.push(id);
//     } else {
//       if (person.firstParent || person.secondParent) {
//         const newFamily: Family = {
//           firstParent: person.firstParent,
//           secondParent: person.secondParent,
//           children: [id],
//           id: person.graph + "u" + familyIdCounter++,
//         };

//         families.push(newFamily);
//       }
//     }
//   });
//   families.forEach((family) => {
//     if (family.firstParent) {
//       links.push([(family.firstParent as number).toString(), family.id]);
//     }
//     if (family.secondParent) {
//       links.push([(family.secondParent as number).toString(), family.id]);
//     }
//     family.children.forEach((child) =>
//       links.push([family.id, child.toString()])
//     );
//   });

//   //uzupelnij rodziny o rodziny bez dzieci
//   people.forEach((p) => {
//     if (p.partners.length > 0) {
//       p.partners.forEach((partner) => {
//         const foundFamily = families.find(
//           (family) =>
//             (family.firstParent == p.id && family.secondParent == partner.id) ||
//             (family.secondParent == p.id && family.firstParent == partner.id)
//         );
//         if (!foundFamily) {
//           const newFamily: Family = {
//             firstParent: p.id,
//             secondParent: partner.id,
//             children: [],
//             id: "u" + familyIdCounter++,
//           };

//           families.push(newFamily);
//         }
//       });
//     }
//   });

//   const peopleCollection: PeopleCollection = {};

//   const personNodes = people.map((p) => personToNode(p));
//   const isAP = AP(personNodes);
//   people.forEach((p) => (p.canBeDeleted = !isAP[p.id.toString()]));

//   people.forEach((p) => (peopleCollection[p.id] = p));
// //   return { families, links, people: peopleCollection };
// // };

// // export const generateTreeStructures = (people: any): TreeStructure[] => {
//   var graphsDict: Dictionary = [];

//   people.forEach((p: any) => {
//     const graphIndex = p.graph as number;
//     if (!graphsDict[graphIndex]) {
//       graphsDict[graphIndex] = [];
//     }
//     graphsDict[graphIndex].push(p);
//   });

//   const treeStructures: TreeStructure[] = [];
//   for (const graph in graphsDict) {
//     if (Object.prototype.hasOwnProperty.call(graphsDict, graph)) {
//       treeStructures.push(generateTreeStructure(graphsDict[graph]));
//     }
//   }
//   return treeStructures;
// };
var time = 0;

const LabelGraphs = (nodes: WorkPersonNode[]): WorkPersonNode[] => {
  var labelCount = 0;
  var nodesCollection: NodesCollection = {};
  nodes.forEach((n) => {
    n.graph = undefined;
    nodesCollection[n.id] = n;
  });

  nodes.forEach((node) => {
    if (!node.graph) {
      labelCount++;
      LabelsRecursive(nodesCollection, node, labelCount);
    }
  });
  return nodes;
};

const LabelsRecursive = (
  nodes: NodesCollection,
  node: WorkPersonNode,
  label: number
) => {
  node.graph = label;
  node.neighbours.forEach((neighbour) => {
    var neighbourNode = nodes[neighbour];
    if (!neighbourNode.graph) {
      LabelsRecursive(nodes, neighbourNode, label);
    }
  });
};

const AP = (nodes: WorkPersonNode[]): NodesCollection => {
  time = 0;
  var visited: NodesCollection = {};
  var disc: NodesCollection = {};
  var low: NodesCollection = {};
  var parent: NodesCollection = {};
  var isAp: NodesCollection = {};
  var nodesCollection: NodesCollection = {};

  nodes.forEach((n) => {
    visited[n.id] = false;
    parent[n.id] = null;
    isAp[n.id] = false;
    nodesCollection[n.id] = n;
  });

  nodes.forEach((node) => {
    if (visited[node.id] == false) {
      APRecursive(node, visited, disc, low, parent, isAp, nodesCollection);
    }
  });
  return isAp;
};
const APRecursive = (
  node: WorkPersonNode,
  visited: NodesCollection,
  disc: NodesCollection,
  low: NodesCollection,
  parent: NodesCollection,
  isAp: NodesCollection,
  nodes: NodesCollection
) => {
  var { id, neighbours } = node;
  var childrenCount = 0;
  visited[id] = true;
  disc[id] = low[id] = ++time;
  neighbours.forEach((n) => {
    var v = n;

    if (!visited[v]) {
      childrenCount++;
      parent[v] = node;
      APRecursive(nodes[v], visited, disc, low, parent, isAp, nodes);
      low[node.id] = Math.min(low[node.id], low[v]);

      if (parent[node.id] == null && childrenCount > 1) {
        isAp[node.id] = true;
      }
      if (parent[node.id] != null && low[v] >= disc[node.id])
        isAp[node.id] = true;
    } else if (v != parent[node.id]) {
      low[node.id] = Math.min(low[node.id], disc[v]);
    }
  });
};

const personToNode = (person: Person): WorkPersonNode => {
  var childrenIds = person.children.map((a) => a.toString());
  var neighbours = [...childrenIds];
  if (person.firstParent) {
    neighbours.push(person.firstParent.toString());
  }
  if (person.secondParent) {
    neighbours.push(person.secondParent.toString());
  }
  var partners = person.partners.map((p) => p.toString());
  neighbours = [...neighbours, ...partners];

  return {
    id: person.id.toString(),
    neighbours: neighbours,
  };
};
export interface NodesCollection {
  [key: string]: any;
}
export interface Dictionary {
  [key: number]: any;
}
