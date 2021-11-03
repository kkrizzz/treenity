import * as _ from 'lodash';

const fetch = require('node-fetch');

const tokenInfoQuery = `
query ($since: ISO8601DateTime!) {
  ethereum(network: velas) {
    dexTrades(
      options: {limit: 10000},
      time: {since: $since, till: null}
    ) {
      block {
        timestamp{
          unixtime
        }
      }
      baseCurrency {
        decimals
        symbol
        address
      }
      baseAmount
      quoteCurrency {
        decimals
        symbol
        address
      }
      quoteAmount
      quotePrice
      side
      smartContract {
        address {
          address
        }
      }
      exchange {
        address {
          address
        }
      }
      transaction {
        hash
        from: txFrom {
          address
        }
      }
    }
  }
}
`;

export default async function updateTokensData(app) {
  const collection = app.services['velas-dextools'];
  const poolsCollection = app.services['velas-dextools-pools'];

  const lastTrade = (await collection.find({ options: { sort: { time: -1 }, limit: 1 } }))?.[0];
  const lastTradeTime = lastTrade?.time;
  const since =
    (lastTradeTime
      ? new Date(lastTradeTime.getTime() + 1000).toISOString()
      : '2021-10-31T20:00:00.000Z'
    ).slice(0, -5) + 'Z';

  const params = { query: tokenInfoQuery, variables: { since } };
  const tokenDataBitQueryFetch = await fetch('https://graphql.bitquery.io/', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': app.settings.bitquery.get('key'),
    },
    body: JSON.stringify(params),
  });

  if (tokenDataBitQueryFetch.status !== 200) {
    throw new Error(
      `BitQuery: ${tokenDataBitQueryFetch.status}, ${tokenDataBitQueryFetch.statusText}`,
    );
  }
  const bitQueryResult = await tokenDataBitQueryFetch.json();
  const dexTrades = bitQueryResult.data.ethereum.dexTrades;

  for (let i = 0; i < dexTrades.length; i++) {
    const dt = dexTrades[i];

    const kline = {
      qp: dt.quotePrice,
      amount: dt.quoteAmount,
      // time: new Date(dt.timeInterval.minute.replace(' ', 'T') + 'Z'),
      time: new Date(dt.block.timestamp.unixtime * 1000),
      market: dt.smartContract.address.address,
      exchange: dt.exchange.address.address,
      base: dt.baseCurrency,
      quote: dt.quoteCurrency,
      side: dt.side,
      tx: dt.transaction,
      // min: dt.min,
      // max: dt.max,
      // open: parseFloat(dt.open),
      // close: parseFloat(dt.close),
      // med: dt.med,
      // trades: dt.trades,
      // i: 5 * 60,
    };

    const pool = {
      base: kline.base,
      quote: kline.quote,
      market: kline.market,
      createdAt: new Date(dt.block.timestamp.unixtime * 1000),
    };

    const poolBaseAddress = pool.base.address;
    const poolQuoteAddress = pool.quote.address;

    const hasPool = await poolsCollection.Model.findOne({
      'base.address': poolBaseAddress,
      'quote.address': poolQuoteAddress,
      market: pool.market,
    });

    if (!hasPool) {
      await poolsCollection.create(pool);
    }

    await collection.create(kline);
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
