import {
  Family,
  PeopleCollection,
  Person,
  PersonNode,
  TreeStructure,
} from "../model/TreeStructureInterfaces";
import names from "../samples/names.json";
import surnames from "../samples/surnames.json";

export const generateTreeStructure = (people: Person[]): TreeStructure => {
  var familyIdCounter = 0;
  var families: Family[] = [];
  var links: string[][] = [];

  people.forEach((p) => {
    p.children = [];
    p.partners = [];
    p.information.name = names[p.id];
    p.information.surname = surnames[p.id];
  });

  people.forEach((person) => {
    const { id } = person;

    var firstParent: Person | undefined;
    var secondParent: Person | undefined;
    if (person.firstParent) {
      firstParent = people.find((a) => a.id == person.firstParent);
      if (!firstParent) {
        person.firstParent = undefined;
      } else {
        firstParent!.children.push(id);
      }
    }

    if (person.secondParent) {
      secondParent = people.find((a) => a.id == person.secondParent);
      if (!secondParent) {
        person.secondParent = undefined;
      }
    }

    if (firstParent && secondParent) {
      if (!firstParent!.partners.includes(secondParent)) {
        firstParent!.partners.push(secondParent);
      }
      if (!secondParent!.partners.includes(firstParent)) {
        secondParent!.partners.push(firstParent);
      }
    }

    const foundFamily = families.find(
      (family) =>
        (family.firstParent == person.firstParent &&
          family.secondParent == person.secondParent) ||
        (family.secondParent == person.firstParent &&
          family.firstParent == person.secondParent)
    );
    if (foundFamily) {
      foundFamily.children.push(id);
    } else {
      if (person.firstParent || person.secondParent) {
        const newFamily: Family = {
          firstParent: person.firstParent,
          secondParent: person.secondParent,
          children: [id],
          id: "u" + familyIdCounter++,
        };

        families.push(newFamily);
      }
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
  const peopleCollection: PeopleCollection = {};
  people.forEach((p) => (peopleCollection[p.id] = p));

  people.forEach((p) => {
    p.canBeDeleted = canBeDeleted(p);
  });

  people.forEach((p) => {
    if (p.partners.length > 0) {
      p.partners.forEach((partner) => {
        const foundFamily = families.find(
          (family) =>
            (family.firstParent == p.id && family.secondParent == partner.id) ||
            (family.secondParent == p.id && family.firstParent == partner.id)
        );
        if (!foundFamily) {
          const newFamily: Family = {
            firstParent: p.id,
            secondParent: partner.id,
            children: [],
            id: "u" + familyIdCounter++,
          };

          families.push(newFamily);
        }
      });
    }
  });
  const personNodes = people.map((p) => personToNode(p));
  const isAP = AP(personNodes);
  people.forEach((p) => (p.canBeDeleted = !isAP[p.id.toString()]));

  return { families, links, people: peopleCollection };
};

var time = 0;
const AP = (nodes: PersonNode[]): NodesCollection => {
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
  node: PersonNode,
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
const canBeDeleted = (person: Person): boolean => {
  const { firstParent, secondParent, children, partners } = person;
  const hasParents = firstParent || secondParent;
  const hasPartners = partners.length > 0;

  const noParentsNoPartnerSingleChild =
    !hasParents && children.length == 1 && !hasPartners;

  const noChildrenNoPartner = children.length == 0 && !hasPartners;

  const noParentsHasSinglePartnerAndChildrenWithHim =
    !hasParents &&
    partners.length == 1 &&
    partners[0].children.every((c) => children.includes(c));

  return (
    noParentsHasSinglePartnerAndChildrenWithHim ||
    noChildrenNoPartner ||
    noParentsNoPartnerSingleChild
  );
};

const personToNode = (person: Person): PersonNode => {
  var childrenIds = person.children.map((a) => a.toString());
  var neighbours = [...childrenIds];
  if (person.firstParent) {
    neighbours.push(person.firstParent.toString());
  }
  if (person.secondParent) {
    neighbours.push(person.secondParent.toString());
  }

  return {
    id: person.id.toString(),
    neighbours: neighbours,
  };
};
export interface NodesCollection {
  [key: string]: any;
}
