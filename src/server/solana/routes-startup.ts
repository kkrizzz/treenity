import { Application } from '@feathersjs/express'
import { sessionIdRoute } from "./session-id";

export function routesStartup(app: Application) {
    sessionIdRoute(app)
}