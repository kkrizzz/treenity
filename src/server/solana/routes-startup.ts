import { Application } from '@feathersjs/express';
import { sessionIdRoute } from './session-id';
import { prettierFormat } from '../../mods/solarea/server/prettier';

export function routesStartup(app: Application) {
  sessionIdRoute(app);
  prettierFormat(app);
}
