import { Application } from '@feathersjs/express';
import { URL, URLSearchParams } from 'url';
import fetch from 'node-fetch';

export function graphqlEditorProxy(app: Application) {
  app.use('/solarea/graphql/proxy', async function (req, res) {
    const { url, ...q } = req.query as { url: string; [key: string]: string };

    const cleanProxyUrl = new URL(url.replace(/\/$/, ''));
    cleanProxyUrl.search = new URLSearchParams(q).toString();

    try {
      console.log('Request Proxied -> ' + req.url);
      const response = await fetch(cleanProxyUrl.toString(), {
        method: req.method,
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
      });

      const accessControlAllowOriginHeader = response.headers['access-control-allow-origin'];
      if (accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin) {
        response.headers['access-control-allow-origin'] = origin;
      }

      const data = await response.json();
      res.send(data);
    } catch (e) {}
  });
}
