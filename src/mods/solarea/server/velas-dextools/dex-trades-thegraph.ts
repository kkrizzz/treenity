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

  for (let i = 0; i < dexTrades.length; i++) {
    const dt = dexTrades[i];

    const type = dt.amount0In === '0' ? 'buy' : 'sell';
    const amountA = parseFloat(type === 'sell' ? dt.amount0In : dt.amount0Out);
    const amountB = parseFloat(type === 'buy' ? dt.amount1In : dt.amount1Out);

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
      qp: 1 / trade1.qp,
      amount: amountB,
      quote: trade1.base,
      base: trade1.quote,
      side: trade1.side === 'buy' ? 'sell' : 'buy',
    });

    // const pool = {
    //   base: trade.base,
    //   quote: trade.quote,
    //   market: trade.market,
    //   createdAt: new Date(dt.block.timestamp.unixtime * 1000),
    // };
    //
    // const poolBaseAddress = pool.base.address;
    // const poolQuoteAddress = pool.quote.address;
    //
    // const hasPool = await poolsCollection.Model.findOne({
    //   'base.address': poolBaseAddress,
    //   'quote.address': poolQuoteAddress,
    //   market: pool.market,
    // });
    //
    // if (!hasPool) {
    //   await poolsCollection.create(pool);
    // }

    await collection.create(trade1);
    await collection.create(trade2);
  }

  // updateTradesData(baseTokenAddress, tokenInfo, group, collection);

  // const groupedByBaseCurrency = _.groupBy(
  //   dexTrades,
  //   (i) => `${i.baseCurrency.address}_${i.quoteCurrency.address}`,
  // );
  // Object.keys(groupedByBaseCurrency).forEach((key) => {
  //   const group = groupedByBaseCurrency[key];
  //   const baseTokenAddress = key;
  //   const tokenInfo = group[0].baseCurrency;
  //   updateTokenData(baseTokenAddress, tokenInfo, group, collection);
  // });
}

const interval1day = 86400000;
const interval4hour = Math.floor(interval1day / 96);

export const updateTokenData = async (address, smartContract, trades, collection) => {
  try {
    const groupedByMarket = _.groupBy(trades, (i) => i.exchange?.address?.address);

    Object.keys(groupedByMarket).forEach((marketAddress) => {
      const market = groupedByMarket[marketAddress];

      market.forEach((trade) => {
        const tradeTime = new Date(trade.block.timestamp.time).getTime();
        trade.group = Math.trunc(tradeTime / interval4hour);
      });
    });

    /*
     { market : trades : group }
     */
    const marketCandles = Object.keys(groupedByMarket).map((marketAddress) => {
      const market = groupedByMarket[marketAddress];

      const groupedTrades = _.groupBy(market, 'group');

      const tradesAsCandles = Object.keys(groupedTrades).map((key, index) => {
        const group = groupedTrades[key];
        const number = Number(key);

        try {
          return {
            time: (number * interval4hour) / 1000,
            open:
              index !== 0
                ? _.head(groupedTrades[Object.keys(groupedTrades)[index - 1]]).quotePrice // close price of prev candle
                : _.last(group).quotePrice,
            high: _.maxBy(group, 'quotePrice').quotePrice,
            low: _.minBy(group, 'quotePrice').quotePrice,
            close: _.head(group).quotePrice,
          };
        } catch (e) {
          console.log(e);
        }
      });

      return {
        market: {
          quote: market[0].quoteCurrency,
        },
        candles: tradesAsCandles,
      };
    });

    const currency = smartContract;
    const tokenSymbol = currency.symbol;

    const tokenData = {
      _id: address,
      currency,
      candles: marketCandles,
    };

    let hasTokenInfo = false;

    try {
      hasTokenInfo = await collection.get(address);
    } catch (e) {}

    if (hasTokenInfo) {
      await collection.patch(address, tokenData);
    } else {
      await collection.create(tokenData);
    }

    console.log('update price: ' + tokenSymbol);
  } catch (e) {
    console.error('error when update price', e);
  }
};
