import { ApplicationState } from "./index";
import { EntityId } from "@reduxjs/toolkit";
import { FamilyNode } from "../components/tree/model/FamilyNode";
import { mockPerson, PersonNode } from "../components/tree/model/PersonNode";
import { Link } from "../components/tree/treeReducer";
import { mapCollectionToEntity } from "./helpers";

export const createMockFamily = (
  firstParent: EntityId | null,
  secondParent: EntityId | null,
  children: EntityId[],
  familyId: string
): { family: FamilyNode; people: PersonNode[]; links: Link[] } => {
  const links: Link[] = [];
  const people: PersonNode[] = [];
  if (!firstParent && !secondParent) {
    throw "Missing parents";
  }

  if (firstParent) {
    people.push(
      new PersonNode(firstParent, mockPerson, 0, 0, children, null, null, [
        familyId,
      ])
    );
    links.push(new Link(firstParent, familyId));
  }
  if (secondParent) {
    people.push(
      new PersonNode(secondParent, mockPerson, 0, 0, children, null, null, [
        familyId,
      ])
    );
    links.push(new Link(secondParent, familyId));
  }

  children.forEach((c) => {
    people.push(
      new PersonNode(c, mockPerson, 0, 0, [], firstParent, secondParent, [
        familyId,
      ])
    );
    links.push(new Link(familyId, c));
  });
  const family: FamilyNode = new FamilyNode(
    familyId,
    0,
    0,
    children,
    firstParent,
    secondParent
  );

  return { family, links, people };
};

export const mockStateWithSingleFamily = (state: ApplicationState) => {
  const { family, people, links } = createMockFamily(1, 2, [3, 4], "u1");

  state.tree.families = mapCollectionToEntity([family]);
  state.tree.links = mapCollectionToEntity(links);
  state.tree.nodes = mapCollectionToEntity(people);
};
