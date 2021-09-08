import { Application } from '@feathersjs/express';
const { Pool, Client } = require('pg');

const client = new Client({
  user: 'public_readonly',
  host: '104.199.89.51',
  database: 'mainnet_explorer',
  password: 'nearprotocol',
  port: 5432,
});
client.connect();

export function nearIndexer(app: Application) {
  app.post('/solarea/near/acctx', async (req, res) => {
    const entityId = req.body.entityId;
    res.send(
      await client.query(`SELECT * FROM TRANSACTIONS WHERE signer_account_id='${entityId}';`),
    );
  });
}
