import { useEffect, useMemo } from 'react';
import { types } from 'mobx-state-tree';
import { addComponent } from '../../treenity/context/context-db';
import { meta } from '../../treenity/meta/meta.model';
import { useApp } from '../../treenity/react/useApp';
import createClientDb from '../mongo/mongod';
import mongoService from 'feathers-mongodb';
import { randomString } from '../dataflow/utils/randomString';

const { Pool, Client } = require('pg');

const CashServiceMeta = meta(
  'cache.service',
  types.model({
    collectionName: types.string,
    baseUrl: types.string,
    sql: types.model({
      user: types.string,
      host: types.string,
      database: types.string,
      password: types.string,
      port: types.number,
    }),
  }),
);

const updateStats = async (app, value, sqlClient) => {
  const service = app.service(value.baseUrl);
  const startIndexDate = new Date();
  startIndexDate.setHours(0, 0, 0, 0);

  const targetDate = new Date(startIndexDate);

  //indexing
  for (let i = 0; i < 14; i++) {
    targetDate.setDate(targetDate.getDate() - 1);

    if (i !== 0) {
      startIndexDate.setDate(startIndexDate.getDate() - 1);
    }

    const alreadyHas = await service.find({ query: { from: targetDate, to: startIndexDate } });

    if (alreadyHas[0]) {
      console.log('Cash.service: already has this elem');
      continue;
    }

    try {
      const totalTxs24hr = await sqlClient.query(`
        SELECT COUNT(*) FROM transactions
        WHERE block_timestamp >= ${targetDate.getTime() * 1000000} AND block_timestamp < ${
        startIndexDate.getTime() * 1000000
      }`);

      const totalAccs4hr = await sqlClient.query(`
        SELECT COUNT(*) FROM accounts 
        JOIN receipts
        ON receipts.receipt_id=accounts.created_by_receipt_id 
        WHERE included_in_block_timestamp > ${
          targetDate.getTime() * 1000000
        } AND included_in_block_timestamp < ${startIndexDate.getTime() * 1000000}
    `);

      const newItem = {
        _id: randomString(12),
        from: targetDate,
        to: startIndexDate,
        totalTxs24hr: totalTxs24hr.rows[0].count,
        totalAccs24hr: totalAccs4hr.rows[0].count,
      };

      await service.create(newItem);

      console.log('Cash.service: added new elem');
    } catch (e) {
      console.log('error');
    }
  }
  sqlClient.end();
};

addComponent(CashServiceMeta, 'service', {}, ({ value }) => {
  const app = useApp();
  const clientDb = useMemo(() => createClientDb(app), []);

  useEffect(() => {
    console.log('starting cash service on', value.baseUrl);
    (async function () {
      const db = await clientDb;
      app.use(
        value.baseUrl,
        mongoService({
          Model: db.collection(value.collectionName),
        }),
      );
      const sqlClient = new Client(value.sql);
      sqlClient.connect();
      sqlClient.once('error', () => console.log('error in once'));
      try {
        await updateStats(app, value, sqlClient);
      } catch (e) {
        console.log('error in hook');
      }
    })();

    return () => undefined;
  }, [value.baseUrl]);

  return null;
});
