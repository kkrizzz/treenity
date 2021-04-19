import { Application } from '@feathersjs/express';
import { sessionIdRoute } from './session-id';
import { prettierFormat } from '../../mods/solarea/server/prettier';
import {emailSubscribeRoute} from "./email-subscribe";

export function routesStartup(app: Application) {
  sessionIdRoute(app);
  prettierFormat(app);
  emailSubscribeRoute(app)
}
