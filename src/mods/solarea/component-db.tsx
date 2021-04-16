import set from 'lodash/set';
import get from 'lodash/get';

export const components: { [code: string]: any } = {};

export function getComponent(id, name, context): { component: any, [name: string]: any } {
  return get(components, [id, context, name]);
}

export function addComponent(id, name, context, options, component) {
  set(components, [id, context, name], { component, ...options });
}
