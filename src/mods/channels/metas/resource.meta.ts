import { Instance, types } from 'mobx-state-tree';
import { meta } from '../../../treenity/meta/meta.model';

export const Resource = types.model('resource', {
  name: types.string,
  dir: types.enumeration('dir', ['in', 'out']),
});

export const ResourcesMeta = meta(
  'resources.meta',
  types.model({
    resources: types.array(Resource),
  }),
);
export interface IResourceMeta extends Instance<typeof ResourcesMeta> {}
