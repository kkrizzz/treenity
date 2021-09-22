import { Application } from '@feathersjs/express';
const { Pool, Client } = require('pg');
const fetch = require('node-fetch');

const client = new Client({
  user: 'public_readonly',
  host: '104.199.89.51',
  database: 'mainnet_explorer',
  password: 'nearprotocol',
  port: 5432,
});
client.connect();

export function nearIndexer(app: Application) {
  app.post('/near/api/acctx', async (req, res) => {
    let { entityId, limit, offset = 0 } = req.body;
    if (!(0 < limit && limit < 100)) limit = 10;
    if (!(offset >= 0)) offset = 0;

    const result = await client.query(`
        SELECT * FROM transactions 
        JOIN transaction_actions 
        ON transactions.transaction_hash=transaction_actions.transaction_hash 
        WHERE signer_account_id='${entityId}'
        OR receiver_account_id='${entityId}'
        LIMIT ${limit}
        OFFSET ${offset}
        ;
      `);

    result.rows = result.rows.sort((a, b) => b.block_timestamp - a.block_timestamp);
    res.send(result);
  });
  app.get('/near/api/todaystats', async (req, res) => {
    // let { entityId, limit, offset = 0, from_timestamp, to_timestamp } = req.body;
    // if (!(0 < limit && limit < 100)) limit = 10;
    // if (!(offset >= 0)) offset = 0;

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);

    const yesterday = new Date(tomorrow);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalTxsToday = await client.query(`
        SELECT COUNT(*) FROM transactions
        WHERE block_timestamp > ${yesterday.getTime() * 1000000} AND block_timestamp < ${
      tomorrow.getTime() * 1000000
    }
    `);

    const totalAccsToday = await client.query(`
        SELECT COUNT(*) FROM accounts 
        JOIN receipts
        ON receipts.receipt_id=accounts.created_by_receipt_id 
        WHERE included_in_block_timestamp > ${
          yesterday.getTime() * 1000000
        } AND included_in_block_timestamp < ${tomorrow.getTime() * 1000000}
    `);

    res.send({
      totalTxsToday: totalTxsToday.rows[0].count,
      totalAccsToday: totalAccsToday.rows[0].count,
    });
  });
  app.get('/near/api/tx/:id', async (req, res) => {
    const txId = req.params.id;

    const txWithBlock = await client.query(`
        SELECT * FROM transactions
        JOIN blocks
        ON transactions.included_in_block_hash = blocks.block_hash
        WHERE transactions.transaction_hash='${txId}'
        ;
    `);

    const txActions = await client.query(`
        SELECT * FROM transaction_actions
        WHERE transaction_hash='${txId}'
        ;
    `);

    txWithBlock.rows[0].actions = txActions.rows;

    res.send(txWithBlock.rows[0]);
  });
  app.get('/near/api/block/:id', async (req, res) => {
    const blockHeight = req.params.id;

    const block = await client.query(`
        SELECT * FROM blocks
        WHERE block_height='${blockHeight}'
        ;
    `);

    const transactions = await client.query(`
        SELECT * FROM transactions
        JOIN transaction_actions 
        ON transaction_actions.transaction_hash=transactions.transaction_hash
        WHERE transactions.included_in_block_hash='${block.rows[0].block_hash}'
    `);

    block.rows[0].transactions = transactions.rows;

    res.send(block.rows[0]);
  });
}
