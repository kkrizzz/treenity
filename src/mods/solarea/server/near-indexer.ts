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
    let { entityId, limit, offset = 0 } = req.body;
    if (!(0 < limit && limit < 100)) limit = 10;
    if (!(offset >= 0)) offset = 0;

    res.send(
      await client.query(`
        SELECT * FROM transactions 
        JOIN transaction_actions 
        ON transactions.transaction_hash=transaction_actions.transaction_hash 
        WHERE signer_account_id='${entityId}'
        LIMIT ${limit}
        OFFSET ${offset}
        ;
      `),
    );
  });
}
