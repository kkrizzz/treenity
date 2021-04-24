import { Application } from '@feathersjs/express';
import { sessionIdRoute } from './session-id';
import { prettierFormat } from './prettier';
import { emailSubscribeRoute } from './email-subscribe';

export function routesStartup(app: Application) {
  sessionIdRoute(app);
  prettierFormat(app);
  emailSubscribeRoute(app);
}
