import {
  Family,
  PeopleCollection,
  Person,
  TreeStructure,
} from "../model/TreeStructureInterfaces";

export const generateTreeStructure = (people: Person[]): TreeStructure => {
  var familyIdCounter = 0;
  var families: Family[] = [];
  var links: string[][] = [];

  people.forEach((person) => {
    const { firstParent, secondParent, id } = person;
    const foundFamily = families.find(
      (family) =>
        family.firstParent == firstParent && family.secondParent == secondParent
    );
    if (foundFamily) {
      foundFamily.children.push(id);
    } else {
      if (firstParent || secondParent) {
        const newFamily: Family = {
          firstParent,
          secondParent,
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

  return { families, links, people: peopleCollection };
};
