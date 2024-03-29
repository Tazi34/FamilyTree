import { PersonNode } from "../../../../model/PersonNode";
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
    x: personNode.x,
    y: personNode.y,
    families: personNode.families as string[],
    canEdit: Boolean(personNode.canEdit),
  };
};

const mapToLocal = (apiNode: TreeNodeAPI): PersonNode => {
  const { birthday, name, surname, description, pictureUrl } = apiNode;
  const node = new PersonNode(
    apiNode.nodeId,
    apiNode.treeId,
    apiNode.canEdit,
    {
      name,
      surname,
      birthday,
      description,
      pictureUrl: pictureUrl,
      sex: apiNode.sex,
    },
    apiNode.x,
    apiNode.y,
    apiNode.children,
    apiNode.fatherId,
    apiNode.motherId,
    [],
    apiNode.partners,
    apiNode.userId
  );
  node.families = apiNode.families;
  node.hidden = Boolean(apiNode.hidden);
  return node;
};

export const treeNodeMapper = {
  mapToLocal,
  mapToAPI,
};
