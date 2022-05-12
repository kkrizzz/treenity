import { useEffect, useMemo } from 'react';
import { types } from 'mobx-state-tree';
import { HookContext } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';
import fs from 'fs/promises';
import { addComponent } from '../../treenity/context/context-db';
import { meta } from '../../treenity/meta/meta.model';
import { useApp } from '../../treenity/react/useApp';
import mongoService from 'feathers-mongodb';
import search from 'feathers-mongodb-fuzzy-search';
import createClientDb from '../mongo/mongod';

const RestServiceMeta = meta(
  'rest.service',
  types.model({
    fileSystem: types.string,
    baseUrl: types.string,
    collectionName: types.string,
    whitelist: types.array(types.string),
    allowedFields: types.array(types.string),
  }),
);

interface ctx extends HookContext {
  session: any;
}

const loadFromFs = async (app, context: ctx, value: any) => {
  try {
    if (!value.fileSystem) throw new Error('no filesystem');
    const fileName = context.id.replace(/~/g, '/') + '.jsx';
    const checkInFs = await fs
      .readFile(`${value.fileSystem}/${fileName}`, 'utf-8')
      .catch(() => fs.readFile(`${value.fileSystem}/-/${fileName}`, 'utf-8'));
    if (checkInFs)
      context.result = {
        data: checkInFs,
        owner: [],
        type: 1,
        _id: context.id,
      };
  } catch (e) {
    console.error(e);
  }
  return context;
};

const validate = async (app, context: ctx) => {
  const sid = context.params.headers?.session;
  const session = (await app.service('session').find({ query: { sid } }))[0];
  if (!session || !session.valid) throw new Error('Invalid session');

  context.session = session;
  context.data = { ...context.data };

  return context;
};

const checkOwner = async (app, context: ctx) => {
  const targetId = context.id as string;
  if (targetId.slice(targetId.length - 5) === 'draft') return context;

  const { session } = context;
  const target = await context.service.get(targetId);

  const isOwner = Array.isArray(target.owner)
    ? target.owner.includes(session.pubkey)
    : session.pubkey === target.owner;

  if (!isOwner) {
    throw new Forbidden(`permission denied - \nowner(${target.owner})\neditor(${session.pubkey})`);
  }
};

const setOwner = async (app, context: ctx) => {
  context.data.owner = [context.session.pubkey];
  return context;
};

const checkData = async (app, context: ctx) => {
  delete context.data.owner;

  return context;
};

const fixError = (ctx) => {
  if (ctx.error.code && !ctx.error.statusCode) {
    ctx.error.statusCode = ctx.error.code;
  }
};

addComponent(RestServiceMeta, 'service', {}, ({ value }) => {
  const app = useApp();
  const db = useMemo(() => createClientDb(app), []);

  useEffect(() => {
    console.log('starting rest service on', value.baseUrl);
    db.then((db) => {
      app.use(
        value.baseUrl,
        mongoService({
          Model: db.collection(value.collectionName),
          whitelist: value.whitelist,
        }),
      );

      app.service(value.baseUrl).hooks({
        before: {
          get: [(ctx) => loadFromFs(app, ctx, value)],
          create: [(ctx) => validate(app, ctx), (ctx) => setOwner(app, ctx)],
          patch: [
            (ctx) => validate(app, ctx),
            (ctx) => checkOwner(app, ctx),
            (ctx) => checkData(app, ctx),
          ],
        },
        error: {
          all: [fixError],
        },
      });
    });

    return () => undefined;
  }, [value.baseUrl]);

  return null;
});
