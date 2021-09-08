import { Application } from '@feathersjs/express';
import { prettierFormat } from './prettier';
import { emailSubscribeRoute } from './email-subscribe';
import { klinesProxy } from './klines-proxy';
import { nearIndexer } from './near-indexer';

export function routesStartup(app: Application) {
  prettierFormat(app);
  emailSubscribeRoute(app);
  klinesProxy(app);
  nearIndexer(app);
}
