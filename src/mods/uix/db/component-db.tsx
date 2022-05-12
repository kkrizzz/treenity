import set from 'lodash.set';
import get from 'lodash.get';
// import IComponentQuery from '../../solarea/editor/NewEditor/types/IComponentQuery';
import { SolareaViewData } from '../storage/adapters/IStorageAdapter';

export const components: { [code: string]: any } = {};

interface ComponentInfo {
  component: any;
  viewData?: SolareaViewData;
  [name: string]: any;
}

export function getComponent(url): ComponentInfo {
  return get(components, url);
}

export function addComponent(url, options, component) {
  set(components, url, { component, ...options });
}
