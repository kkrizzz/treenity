import { getType, isStateTreeNode, isType } from 'mobx-state-tree';

const getTypeName = (type) => {
  if (isType(type)) return type.name;
  if (isStateTreeNode(type)) return getType(type).name;

  throw new Error('unknown type type');
};

export default getTypeName;
