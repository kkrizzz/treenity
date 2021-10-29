import './source-maps';
import helmet from 'helmet';
import cors from 'cors';
import uuid from 'uuid';

import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import mongoService from 'feathers-mongodb';
import socketio from '@feathersjs/socketio';
import configuration from '@feathersjs/configuration';
// import authentication from './authentication';
import '../mods/server';

import '../common';

import config from '../config-common';
import createClientDb from '../mods/mongo/mongod';
import '../treenity/service';
import { TreeService } from '../treenity/tree/server';

import { Node } from '../treenity/tree/node';

import services from './services';
import '../treenity/service/Sysinit';
import { routesStartup as solareaRoutes } from '../mods/solarea/server/routes-startup';
import migrate from './migrator';
import { sessionIdRoute } from '../mods/solarea/server/session-id';

config.isServer = true;

async function main() {
  const app = express(feathers());

  app.configure(configuration());

  const db = await createClientDb(app);
  (app as any).collection = function collection(name) {
    return this.use(
      name,
      mongoService({
        Model: db.collection(name),
        disableObjectify: true,
      }),
    );
  };
  app.collection('config');

  // await migrate(app);

  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.configure(express.rest());
  app.configure(socketio());
  app.use(express.errorHandler());

  app.collection('nodes');
  app.collection('changes');
  app.collection('edges');
  app.collection('users');
  app.collection('session');
  app.collection('near-token-price');
  app.collection('near-token-metadata');
  app.collection('velas-dextools');
  app.collection('velas-dextools-pools');
  app.collection('velas-dextools-liqudity');
  const tree = app
    .use('tree', new TreeService())
    .service('tree')
    .hooks({
      error: {
        all: [(err) => console.error(err.stack)],
      },
      after: {
        find: [
          function (context) {
            const { result } = context;
            if (result) {
              result.data = result.data.map((snap) => Node.create(snap));
            }
            return context;
          },
        ],
        get: [
          function (context) {
            if (context.result) {
              context.result = Node.create(context.result);
            }
            return context;
          },
        ],
      },
    });

  app.configure(solareaRoutes);
  sessionIdRoute(app);
  // app.use('message', new MessageService());
  //
  // app.use('hello', new HelloService());

  const host = app.get('host');
  const port = app.get('port');

  app.listen(
    {
      host,
      port,
    },
    () => {
      console.log(`App is running on http://${host}:${port}`);

      app.on('connection', (connection) => {
        connection.headers.cookie = uuid.v4();
        // app.channel('tree').join(connection);
        app.channel('anonymous').join(connection);
      });

      app.on('disconnect', (connection) => {
        app.channel('anonymous').leave(connection);
      });
    },
  );

  await app.setup();
  app.configure(services);
}

main().then(console.log, console.error);
