import { SolareaViewId } from '../storage-adapters/SolareaViewId';
import { mimeTypesData } from '../utils/mime-types-data';
import { hook } from './hook';

hook('shouldFetch', function (next, url) {
  return url.startsWith('solarea://') || next();
});

hook('fetch', async function (next, url) {
  if (!url.startsWith('solarea://')) return next();

  const [, , address, name, context = 'code'] = url.split('/');

  System.register([], function (e) {
    return {
      execute: async () => {
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

        await eval('(async function() { let exports = {}; ' + viewCode + ';e(exports);})()');
      },
    };
  });

  return new Response(
    new Blob([``], {
      type: 'application/javascript',
    }),
  );
});
