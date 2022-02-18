import set from 'lodash/set';
import get from 'lodash/get';
import IComponentQuery from './editor/NewEditor/types/IComponentQuery';
import { SolareaViewData } from './storage-adapters/IStorageAdapter';

export const components: { [code: string]: any } = {};

interface ComponentInfo {
  component: any;
  viewData?: SolareaViewData;
  [name: string]: any;
}

export function getComponent(id, name, context): ComponentInfo {
  return get(components, [id, context, name]);
}

export function addComponent(id, name, context, options, component) {
  set(components, [id, context, name], { component, ...options });
}
