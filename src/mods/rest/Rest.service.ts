import { useEffect } from 'react';
import { types } from 'mobx-state-tree';
import { addComponent } from '../../treenity/context/context-db';
import { meta } from '../../treenity/meta/meta.model';
import { useApp } from '../../treenity/react/useApp';
import mongoService from 'feathers-mongodb';
import search from 'feathers-mongodb-fuzzy-search';
import createClientDb from '../mongo/mongod';
import { HookContext } from '@feathersjs/feathers';
import { Transaction } from '@solana/web3.js';

const RestServiceMeta = meta(
  'rest.service',
  types.model({
    baseUrl: types.string,
    collectionName: types.string,
    whitelist: types.array(types.string),
    allowedFields: types.array(types.string),
  })
);

interface ctx extends HookContext {
  session: any;
}

const validate = async (app, context: ctx) => {
  const targetId = context.id as string;
  if(targetId.slice(targetId.length-5)==='draft') return context;

  await checkOwner(app, context);
  return context;
};

const checkOwner = async (app, context: ctx) => {
  const sid = context.params.headers?.session
  const session = (await app.service('session').find({ query: { sid } }))[0];
  if(!session.valid) throw new Error('Invalid session');

  const targetId = context.id as string;
  const target = await context.service.get(targetId);

  const isOwner = Array.isArray(target.owner)
      ? target.owner.includes(session.pubkey)
      : session.pubkey === target.owner;

  if (!isOwner) {
    throw new Error(
        `permission denied - \nowner(${target.owner})\neditor(${session.pubkey})`,
    );
  }
}

addComponent(RestServiceMeta, 'service', {}, ({ value }) => {
  const app = useApp();
  const db = createClientDb(app);

  useEffect(() => {
    console.log('starting rest service on', value.baseUrl);
    db.then((db) => {
      app.use(
        value.baseUrl,
        mongoService({
          Model: db.collection(value.collectionName),
          whitelist: value.whitelist,
        })
      );

      app.service(value.baseUrl).hooks({
        before: {
          create: [(ctx) => validate(app, ctx)],
          patch: [
            (ctx) => validate(app, ctx),
          ],
        },
      });
    });

    return () => undefined;
  }, [value.baseUrl]);

  return null;
});
