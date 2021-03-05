import set from 'lodash/set';
import { get } from 'lodash';

export const components: { [code: string]: any } = {};

export function getComponent(id, name, context): { component: any, [name: string]: any } {
  return get(components, [id, context, name]) ||
    // return default component for context if not found
    get(components, ['default', context, 'default']);
}

export function addComponent(id, name, context, options, component) {
  set(components, [id, context, name], { component, ...options });
}
