import { mimeTypesData } from '../utils/mime-types-data';
import { loadScript } from './load-script';
import { createExecutionContext } from './create-execution-context';
import { addComponent } from '../db/component-db';
// import { resolveViewByMime } from '../../solarea/components/Files/Resolver';

export async function loadScriptComponent(url, apis: any[]) {
  try {
    // do {
    const results = await Promise.allSettled(
      apis.map((api) => api.get(url, { resolveLinks: true })),
    );

    const viewData = (results.find(
      (res) => res.status === 'fulfilled' && res.value,
    ) as PromiseFulfilledResult<any>)?.value;

    if (!viewData) {
      const error = (results.find(
        (res) => res.status === 'rejected' && res.reason,
      ) as PromiseRejectedResult)?.reason;
      if (error) throw error;
      return false;
    }

    if (viewData.type === mimeTypesData['solarea/jsx']) {
      const viewCode = viewData.data.toString('utf-8');

      await loadScript(url, viewCode, {
        ...createExecutionContext(),
        add(component, options = {}): void {
          component.displayName = url;
          addComponent(url, { ...options, viewData }, component);
        },
      });
    } else {
      const view = null; //resolveViewByMime({ mimetype: viewData.type, data: viewData.data });
      if (view) {
        addComponent(url, {}, view);
      } else {
        throw new Error(`mimetype not resolved ${viewData.type}`);
      }
    }
  } catch (err) {
    console.log(err);
    // addComponent(address, name, context, {}, getComponent('default', 'default', context).component,);
  }
}
