import { PersonInformation, PersonNode } from "../../model/PersonNode";
import { TreeNodeAPI } from "./TreeModel";

const mapToAPI = (personNode: PersonNode): TreeNodeAPI => {
  return {
    birthday: personNode.personDetails.birthday,
    nodeId: personNode.id as number,
    userId: personNode.userId ?? 0,
    children: personNode.children as number[],
    partners: personNode.partners as number[],
    description: personNode.personDetails.description,
    fatherId: (personNode.firstParent as number) ?? 0,
    motherId: (personNode.secondParent as number) ?? 0,
    name: personNode.personDetails.name,
    surname: personNode.personDetails.surname,
    pictureUrl: personNode.personDetails.pictureUrl,
    treeId: personNode.treeId,
  };
};

const mapToLocal = (apiNode: TreeNodeAPI): PersonNode => {
  const { birthday, name, surname, description, pictureUrl } = apiNode;
  const node = new PersonNode(
    apiNode.nodeId,
    apiNode.treeId,
    {
      name,
      surname,
      birthday,
      description,
      pictureUrl: pictureUrl,
    },
    0,
    0,
    apiNode.children,
    apiNode.fatherId,
    apiNode.motherId,
    [],
    apiNode.partners,
    apiNode.userId
  );
  return node;
};

const getPersonInformation = (node: TreeNodeAPI): PersonInformation => {
  const { birthday, name, surname, pictureUrl, description } = node;
  return {
    birthday,
    name,
    surname,
    pictureUrl,
    description,
  };
};

export const treeNodeMapper = {
  mapToLocal,
  mapToAPI,
  getPersonInformation,
};
