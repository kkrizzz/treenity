import { addComponent, getTypeContextConfig } from '../context/context-db';
import { meta } from '../meta/meta.model';
import { types } from 'mobx-state-tree';
import { UnionMetaType } from './node';

export async function applyResolver(resolverNode, query, app) {
  const metaData = resolverNode?._m.find(m => m._tg.includes('~tree'));
  if (!metaData) throw new Error('wrong resolver');

  const meta = UnionMetaType.create(metaData);
  const config = getTypeContextConfig(metaData._t, 'resolver');
  if (!config) throw new Error('wrong resolver');

  const data = await config.component({
    value: meta,
    node: resolverNode,
    query,
    app,
    onChange: async (value: any) => {
    },
  });
  return data;
}

const MongoResolverMeta = meta('mongo.resolver', types.model({
  collection: types.string,
}));

const MongoResolver = async ({ value, node, query, app }) => {
  const collection = app.service(value.collection);

  if (query._p && query._p !== node._id) {
    const parent = await collection.get(query._p);
    try {
      return await applyResolver(parent, query, app);
    } catch (e) {
      console.log('resolver', e.message);
    }
  }

  return await collection.find({ query });
};

addComponent(MongoResolverMeta, 'resolver', {}, MongoResolver);
