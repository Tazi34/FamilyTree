export const getNodeId = (id) => {
  return `n${id}`;
};
export const getLinkId = (sourceId, targetId) => {
  return `l${sourceId}_${targetId}`;
};
export const getNodeIdSelector = (id) => {
  return `#${getNodeId(id)}`;
};
export const getLinkIdSelector = (sourceId, targetId) => {
  return `#${getLinkId(sourceId, targetId)}`;
};
