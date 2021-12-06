import { Application } from '@feathersjs/express';
import _ from 'lodash';
const { Pool, Client } = require('pg');
const fetch = require('node-fetch');

const sortByTimeThenId = (a, b) => {
  const time =
    a.receipt_action.receipt_included_in_block_timestamp -
    b.receipt_action.receipt_included_in_block_timestamp;
  return (
    time || b.receipt_action.index_in_action_receipt - b.receipt_action.index_in_action_receipt
  );
};

export async function nearIndexer(app: Application) {
  const nearConfig = app.get('near');

  const client = new Client(nearConfig.pgCredentials);

  await client.connect().catch((err) => console.log('near: cannot connect to db: ', err));

  app.collection('near-token-price');
  app.collection('near-token-metadata');

  app.post('/api/near/acctx', async (req, res) => {
    let { entityId, limit, offset = 0 } = req.body;
    if (!limit) limit = 10;
    if (!(offset >= 0)) offset = 0;

    const transactions = await client.query(`
        select *, 
        array(
          select json_agg(
            json_build_object(
            'receipt', row_to_json(receipts),
            'receipt_action', row_to_json(action_receipt_actions)
            )) from receipts
            
            JOIN action_receipt_actions
            ON action_receipt_actions.receipt_id = receipts.receipt_id
            WHERE originated_from_transaction_hash = transactions.transaction_hash
          ) as "actions", 
        array(
          SELECT json_agg(
            json_build_object('transaction_actions', row_to_json(transaction_actions))
          ) 
          FROM transaction_actions
          WHERE transaction_actions.transaction_hash = transactions.transaction_hash
        ) as "tx_actions"
              
        from transactions
        WHERE signer_account_id='${entityId}'
        OR receiver_account_id='${entityId}'
        ORDER BY block_timestamp DESC
        LIMIT ${limit}
        OFFSET ${offset}
    `);

    // const groupedByHash = _.groupBy(transactions.rows, 'transaction_hash');
    //
    // const targetData = _.map(groupedByHash, (receipts, hash) => {
    //   const actions = _.groupBy(receipts, 'receipt_id');
    //   return {
    //     ..._.last(receipts),
    //     receipts: receipts.map((receipt) => {
    //       receipt.actions = actions[receipt.receipt_id];
    //       return receipt;
    //     }),
    //   };
    // });

    const targetData = transactions.rows.map((i) => {
      i.actions = i.actions[0]?.sort(sortByTimeThenId);
      i.tx_actions = i.tx_actions[0].map((c) => c.transaction_actions);
      return i;
    });

    res.send(targetData);
  });
  app.get('/api/near/todaystats', async (req, res) => {
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
  app.get('/api/near/tx/:id', async (req, res) => {
    const txId = req.params.id;

    const txWithBlock = await client.query(`
      SELECT *, array(
        SELECT json_agg(
          json_build_object(
            'receipt', row_to_json(receipts),
            'receipt_action', row_to_json(action_receipt_actions)
          )
        ) from receipts
            
        JOIN action_receipt_actions
        ON action_receipt_actions.receipt_id = receipts.receipt_id
        WHERE originated_from_transaction_hash = transactions.transaction_hash
      ) as "actions"
        
      FROM transactions
      JOIN transaction_actions 
      ON transaction_actions.transaction_hash = transactions.transaction_hash
      JOIN blocks
      ON transactions.included_in_block_hash = blocks.block_hash
      WHERE transactions.transaction_hash='${txId}'
      ;
    `);

    const tx = txWithBlock.rows[0];
    tx.actions = tx.actions[0].sort(sortByTimeThenId);

    res.send(txWithBlock.rows[0]);
  });
  app.get('/api/near/block/:id', async (req, res) => {
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

  app.get('/api/near/blocks/latest', async (req, res) => {
    let { limit, offset = 0 } = req.query;
    if (!(0 < limit && limit < 100)) limit = 10;
    if (!(offset >= 0)) offset = 0;

    const latestBlocks = await client.query(`
      SELECT *, array(
              SELECT json_agg(
                json_build_object(
                  'transactions', row_to_json(transactions)
                )
              ) from transactions
              WHERE transactions.included_in_block_hash = blocks.block_hash
            ) as "txs"
      FROM blocks
      ORDER BY block_timestamp DESC
      LIMIT ${limit}
      OFFSET ${offset}
   `);

    latestBlocks.rows.forEach((block) => {
      block.txs = block?.txs[0]?.map((i) => i.transactions);
    });

    res.send(latestBlocks.rows);
  });

  app.get('/api/near/txs/latest', async (req, res) => {
    let { limit, offset = 0 } = req.query;
    if (!(0 < limit && limit < 100)) limit = 10;
    if (!(offset >= 0)) offset = 0;

    const latestTxs = await client.query(`
      SELECT * FROM transactions
      ORDER BY block_timestamp DESC
      LIMIT ${limit}
      OFFSET ${offset}
   `);

    res.send(latestTxs.rows);
  });
}
