import { Application } from '@feathersjs/express';
import { prettierFormat } from './prettier';
import { emailSubscribeRoute } from './email-subscribe';

export function routesStartup(app: Application) {
  prettierFormat(app);
  emailSubscribeRoute(app);
}
