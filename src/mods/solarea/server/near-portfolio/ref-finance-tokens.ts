import { Application } from '@feathersjs/express';

// @ts-ignore
const fetch = require('node-fetch');
const cron = require('node-cron');

async function nearFetch(body) {
  return fetch('https://rpc.mainnet.near.org/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...body, id: 126, jsonrpc: '2.0' }),
  })
    .then((res) => res.json())
    .then((res) => Buffer.from(res.result.result).toString('utf-8'));
}

async function getTokenMetadata(contract) {
  return nearFetch({
    method: 'query',
    params: [`call/${contract}/ft_metadata`, ''],
  });
}

async function getPools(limit, from_index) {
  return nearFetch({
    method: 'query',
    params: {
      request_type: 'call_function',
      account_id: 'v2.ref-finance.near',
      method_name: 'get_pools',
      args_base64: Buffer.from(
        JSON.stringify({
          limit,
          from_index,
        }),
      ).toString('base64'),
      finality: 'optimistic',
    },
  });
}

async function getNumberOfPools() {
  return nearFetch({
    method: 'query',
    params: {
      request_type: 'call_function',
      account_id: 'v2.ref-finance.near',
      method_name: 'get_number_of_pools',
      finality: 'optimistic',
      args_base64: '',
    },
    id: 126,
    jsonrpc: '2.0',
  });
}

async function fetchPools(pc) {
  let result: any = [];
  const numberOfPools = await getNumberOfPools();
  let offset = 0;

  do {
    const poolData = JSON.parse(await getPools(200, offset));
    result = result.concat(poolData);

    offset += 200;
  } while (offset < numberOfPools);

  await pc.Model.remove({});
  await pc.Model.insertMany(result);
  console.log('Updated pools!');
}

export function indexRefFinanceTokensPrice(app: Application) {
  const priceCollection = app.services['near-token-price'];
  const tokenMetadata = app.services['near-token-metadata'];

  app.get('/api/near/token/:contractId', async (req, res) => {
    try {
      const { contractId } = req.params;
      if (!contractId) return res.sendStatus(500);

      const tokenPool = await priceCollection.Model.findOne({
        token_account_ids: { $all: [contractId, 'wrap.near'] },
      });

      const wrapNearIndex = tokenPool.token_account_ids.findIndex((i) => i === 'wrap.near');
      const targetTokenIndex = tokenPool.token_account_ids.findIndex((i) => i === contractId);
      const tokenPriceInNear =
        tokenPool.amounts[wrapNearIndex] / tokenPool.amounts[targetTokenIndex];

      const nearCurrentInfo = await fetch(
        'https://api.coingecko.com/api/v3/coins/near',
      ).then((res) => res.json());
      const nearPrice = nearCurrentInfo.market_data.current_price.usd;

      let targetTokenMetadata = await tokenMetadata.Model.findOne({ _id: contractId });

      if (!targetTokenMetadata) {
        targetTokenMetadata = JSON.parse(await getTokenMetadata(contractId));
        await tokenMetadata.Model.insertOne({
          _id: contractId,
          ...targetTokenMetadata,
        });
      }

      const tokenPriceInNearInDecimals =
        tokenPriceInNear * Math.pow(10, -Math.abs(24 - targetTokenMetadata.decimals));

      res.status(200).send({
        price: {
          near: tokenPriceInNearInDecimals,
          usd: tokenPriceInNearInDecimals * nearPrice,
        },
      });
    } catch (e) {
      res.sendStatus(500);
    }
  });

  fetchPools(priceCollection);

  cron.schedule('*/30 0-59 * * * *', () => {
    fetchPools(priceCollection);
  });
}
