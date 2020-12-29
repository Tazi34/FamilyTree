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
    fatherId: (personNode.fatherId as number) ?? 0,
    motherId: (personNode.motherId as number) ?? 0,
    name: personNode.personDetails.name,
    surname: personNode.personDetails.surname,
    pictureUrl: personNode.personDetails.pictureUrl,
    treeId: personNode.treeId,
    sex: personNode.personDetails.sex,
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
      //TODO zmienic jak bedzie backend
      sex: "Male",
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
  const { birthday, name, surname, pictureUrl, description, sex } = node;
  return {
    birthday,
    name,
    surname,
    pictureUrl,
    description,
    sex,
  };
};

export const treeNodeMapper = {
  mapToLocal,
  mapToAPI,
  getPersonInformation,
};
