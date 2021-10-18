import * as _ from 'lodash';

const cron = require('node-cron');
const fetch = require('node-fetch');

// Velas Testnet
const TOKENS_TO_INDEX_PRICE = [
  '0xe2172a8e1762ae9962a59ee88a731522a61a4cc9', // BUSD
  '0x6ef054b3e3c3c83e14527e8fa593c2c4435a6ea4', // USDT
  '0x598491beadf07e27b7ef0090c6a7e8e5ee0f3ab7', // WAG
  '0xc119b1d91b44012db8d0ac5537f04c7fd7629c84', // SYX
  '0x297170abcfc7acea729ce128e1326be125a7f982', // WAGYU
  '0x78f18612775a2c54efc74c2911542aa034fe8d3f', // wVLX
];

const tokenInfoQuery = `
query ($after: ISO8601DateTime!) {
  ethereum(network: velas_testnet) {
    dexTrades(
      date: {after: $after}
    ) {
      block {
        timestamp{
          unixtime
        }
      }
      baseCurrency {
        symbol
        address
      }
      baseAmount
      quoteCurrency {
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

    }
  }
}
`;

const updateData = async (collection) => {
  const lastTrade = (await collection.find({ options: { sort: { time: -1 }, limit: 1 } }))?.[0];
  const after = lastTrade?.time.toISOString() || '2020-01-01T00:00:00.000Z';

  const params = { query: tokenInfoQuery, variables: { after } };
  const tokenDataBitQueryFetch = await fetch('https://graphql.bitquery.io/', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': 'BQYuBhWWLDMGNQ7JbDU9BjOoYycCixU9',
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
      // min: dt.min,
      // max: dt.max,
      // open: parseFloat(dt.open),
      // close: parseFloat(dt.close),
      // med: dt.med,
      // trades: dt.trades,
      // i: 5 * 60,
    };
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
};

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

export const indexPriceCron = (app) => {
  const priceCollection = app.services['velas-dextools'];
  priceCollection.Model.createIndex({
    'base.address': 1,
    'quote.address': 1,
    time: 1,
  });

  app.get('/api/velas/market/:base/:quote/trades', async (req, res) => {
    const { base, quote } = req.params;
    const { offset } = req.query;

    const trades = await priceCollection.Model.find(
      { 'base.address': base, 'quote.address': quote },
      { sort: { time: -1 }, limit: 100 },
    ).toArray();

    res.send(trades);
  });

  app.get('/api/velas/klines/:base/:quote', async (req, res) => {
    try {
      const { base, quote } = req.params;
      const { from, to, interval = 1 } = req.query;

      const fromDate = new Date((from || 0) * 1000);
      const toDate = to ? new Date(to * 1000) : new Date();

      const klines = await priceCollection.Model.aggregate([
        {
          $match: {
            'base.address': base,
            'quote.address': quote,
            time: { $gt: fromDate, $lte: toDate },
          },
        },
        {
          $project: {
            frame: {
              $trunc: {
                $divide: [{ $subtract: ['$time', new Date('1970-01-01')] }, interval * 60 * 1000],
              },
            },
            time: 1,
            qp: 1,
            amount: 1,
          },
        },
        { $sort: { time: 1 } },
        {
          $group: {
            _id: '$frame',
            time: { $first: '$time' },
            open: { $first: '$qp' },
            close: { $last: '$qp' },
            high: { $max: '$qp' },
            low: { $min: '$qp' },
            vol: { $sum: '$amount' },
          },
        },
        { $sort: { time: 1 } },
      ]).toArray();
      return res.send(klines);
    } catch (e) {
      console.error(e);
    }
  });

  app.get('/api/velas/token/:token/markets', async (req, res) => {
    try {
      const { token } = req.params;

      let markets = await priceCollection.Model.aggregate([
        {
          $match: {
            'base.address': token,
            'quote.address': { $ne: token },
          },
        },
        {
          $group: {
            _id: '$quote.address',
            quote: { $first: '$quote' },
            base: { $first: '$base' },
            market: { $first: '$market' },
          },
        },
        {
          $sort: { market: 1 },
        },
      ]).toArray();

      // CALCULATE PRICE CHANGES
      for (let i = 0; i < markets.length; i++) {
        const market = markets[i];

        let latestMarketTrade = await priceCollection.Model.findOne(
          { market: market.market },
          { sort: { time: -1 } },
        );

        const latestMarketTrade24hrAgoDate = new Date();
        latestMarketTrade24hrAgoDate.setDate(latestMarketTrade24hrAgoDate.getDate() - 1); // yesterday

        let trade24hrAgo = await priceCollection.Model.findOne(
          {
            time: { $gte: latestMarketTrade24hrAgoDate },
            'base.address': market.base.address,
            'quote.address': market.quote.address,
          },
          { sort: { time: 1 } },
        );

        trade24hrAgo = trade24hrAgo || latestMarketTrade;
        market.priceChange24hrValue = latestMarketTrade.qp - trade24hrAgo.qp;
        market.priceChange24hrPercent = (market.priceChange24hrValue / latestMarketTrade.qp) * 100;

        delete market._id;
      }

      return res.send(markets);
    } catch (e) {
      console.error(e);
    }
  });

  updateData(priceCollection).catch(console.error);

  cron.schedule('*/30 * * * * *', async () => {
    await updateData(priceCollection).catch((err) => {
      console.error('Velas klines update', err);
      throw err;
    });
    // TOKENS_TO_INDEX_PRICE.forEach((i) => updatePrice(i, priceCollection));
  });
};
