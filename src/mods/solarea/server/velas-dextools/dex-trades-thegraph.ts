import * as _ from 'lodash';

const fetch = require('node-fetch');

const tokenInfoQuery = `
query ($after: Int!) {
    swaps(orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $after }) {
      transaction {
        id
        block
      }
      pair {
        id
        name
        token0 {
          id
          name
        }
        token1 {
          id
          name
        }
        token0Price
        token1Price
        reserveUSD
      }
      timestamp
      amount0In
      amount1In
      amount0Out
      amount1Out
      from
      amountUSD
    }
}`;

export default async function updateTheGraphTrades(app) {
  const collection = app.services['velas-dextools-thegraph-swaps'];

  const lastTrade = (await collection.find({ options: { sort: { time: -1 }, limit: 1 } }))?.[0];
  const lastTradeTime = lastTrade?.time;
  const afterDate = lastTradeTime || new Date('2021-10-31T20:00:00.000Z');
  const after = Math.floor(afterDate.getTime() / 1000);

  const params = { query: tokenInfoQuery, variables: { after } };
  const tokenDataBitQueryFetch = await fetch(
    'https://thegraph.wagyuswap.app/subgraphs/name/wagyu',
    {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    },
  );

  if (tokenDataBitQueryFetch.status !== 200) {
    throw new Error(
      `WagyuSwap The Graph: ${tokenDataBitQueryFetch.status}, ${tokenDataBitQueryFetch.statusText}`,
    );
  }
  const queryResult = await tokenDataBitQueryFetch.json();
  const dexTrades = queryResult.data.swaps;

  const toInsert = dexTrades
    .map((dt) => {
      const type = dt.amount0In === '0' ? 'BUY' : 'SELL';
      const amountA = parseFloat(type === 'SELL' ? dt.amount0In : dt.amount0Out);
      const amountB = parseFloat(type === 'BUY' ? dt.amount1In : dt.amount1Out);

      const { token0, token1 } = dt.pair;
      const trade1 = {
        qp: amountA / amountB,
        amount: amountA,
        amountUSD: parseFloat(dt.amountUSD),
        time: new Date(dt.timestamp * 1000),
        market: dt.pair.id,
        quote: { address: token0.id, symbol: token0.name },
        base: { address: token1.id, symbol: token1.name },
        side: type,
        tx: {
          hash: dt.transaction.id,
          from: {
            address: dt.from,
          },
        },
      };
      const trade2 = Object.assign({}, trade1, {
        qp: amountB / amountA,
        amount: amountB,
        quote: trade1.base,
        base: trade1.quote,
        side: trade1.side === 'BUY' ? 'SELL' : 'BUY',
      });

      return [trade1, trade2];
    })
    .flat();

  await collection.Model.insertMany(toInsert);

  return dexTrades.length >= 100;
}
