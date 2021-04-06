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

const validateTx = async (app, context: ctx) => {
  const { headers }: any = context.params;

  if (headers && !headers.tx) throw new Error('No transaction');

  const tx = JSON.parse(headers.tx);
  const transaction = Transaction.from(tx.data);

  if (!transaction.feePayer) throw new Error('No fee payer');
  if (!transaction.verifySignatures()) throw new Error('Validation error');
  const pubkey = transaction.feePayer.toBase58();
  const sid = transaction.instructions[0].data.toString();
  const session = (await app.service('session').find({ query: { pubkey, sid } }))[0];

  if (!session) throw new Error('Something went wrong');
  context.session = session;

  return context;
};

const checkOwner = async (app, context: ctx, collection) => {
  const target = await app.service(collection).get(context.id);
  if (context.session.pubkey !== target.owner)
    throw new Error(
      `permission denied - \nowner(${target.owner})\neditor(${context.session.pubkey})`
    );

  return context;
};

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
          create: [(ctx) => validateTx(app, ctx)],
          patch: [(ctx) => validateTx(app, ctx), (ctx) => checkOwner(app, ctx, value.collectionName)],
        },
      });
    });

    return () => undefined;
  }, [value.baseUrl]);

  return null;
});
