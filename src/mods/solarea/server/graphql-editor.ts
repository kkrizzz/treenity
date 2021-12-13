import { Application } from '@feathersjs/express';
import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

export function graphqlEditorProxy(app: Application) {
  app.use('/solarea/graphql', async function (req, res) {
    const { url, ...q } = req.query;

    var cleanProxyUrl = new URL(url.replace(/\/$/, ''));
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
    // req
    //   .pipe(
    //       fetch(cleanProxyUrl).then((response) => {
    //       const accessControlAllowOriginHeader = response.headers['access-control-allow-origin'];
    //       if (accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin) {
    //         response.headers['access-control-allow-origin'] = origin;
    //       }
    //     }),
    //   )
    // .pipe(res);
  });
}
