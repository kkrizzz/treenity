import { SolareaViewId } from '../storage-adapters/SolareaViewId';
import { mimeTypesData } from '../utils/mime-types-data';
import { hook } from './hook';

hook('shouldFetch', function (next, url) {
  return url.startsWith('solarea://') || next();
});

hook('fetch', async function (next, url) {
  if (!url.startsWith('solarea://')) return next();

  const [, , address, name, context = 'code'] = url.split('/');

  const id = new SolareaViewId(address, name, context);

  const { solanaStorage, restStorage } = globalThis.solarea;

  const [solSettle, restSettle] = await Promise.allSettled([
    solanaStorage.get(id, { resolveLinks: true }),
    restStorage.get(id, { resolveLinks: true }),
  ]);

  const viewData =
    (solSettle.status === 'fulfilled' && solSettle.value) ||
    (restSettle.status === 'fulfilled' && restSettle.value);

  if (!viewData) return;

  const mimetype = mimeTypesData.getMime(viewData.type);
  if (viewData.type !== mimeTypesData['solarea/jsx']) throw new Error('wrong mimetype');

  const viewCode = viewData.data.toString('utf-8');

  const code = `
  System.register([], function (_export) {
    const require = System.import.bind(System);
    let exports = {};
    return {
      execute: async function () {
        ${viewCode}
        _export(exports);
      }
    };
  });
  `;

  return new Response(new Blob([code], { type: 'application/javascript' }));
});
//
// hook('instantiate', async function (next, url, parentUrl) {
//   console.log('instantiate', url, parentUrl);
//   return next();
// });
