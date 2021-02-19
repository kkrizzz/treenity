import { map } from 'lodash';
import { addComponent } from '../context/context-db';
import { meta } from '../meta/meta.model';
import { types } from 'mobx-state-tree';
import { registeredTypes } from '../registeredTypes';

const TypeResolverMeta = meta('types.resolver', types.model({}));


const TypesResolver = async ({ value, node, query, app }) => {
  const result = map(registeredTypes, (type, name) => {
    return {
      _id: `types.${name}`,
      _t: 'node',
      name,
      _m: [],
      _p: node._id,
      _pa: [...node._pa, node._id],
      _r: 0,
      _re: node._id,
    };
  });
  return result;
};

addComponent(TypeResolverMeta, 'resolver', {}, TypesResolver);
