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
query ($tokens: [String!]) {
  ethereum(network: velas_testnet) {
    dexTrades(
      baseCurrency: {in: $tokens},
    ) 
    {
      block {
        timestamp {
          time
        }
      }
      exchange {
        address {
          address
        }
      }
      side
      quotePrice
      quoteCurrency {
        symbol
        address
      }
      baseCurrency {
        symbol
        address
      }
    }
  }
}
`;

const updateData = async (collection) => {
  const tokenDataBitQueryFetch = await fetch('https://graphql.bitquery.io/', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: tokenInfoQuery, variables: { tokens: TOKENS_TO_INDEX_PRICE } }),
  });

  const bitQueryResult = await tokenDataBitQueryFetch.json();
  const dexTrades = bitQueryResult.data.ethereum.dexTrades;

  const groupedByBaseCurrency = _.groupBy(dexTrades, (i) => i.baseCurrency.address);
  Object.keys(groupedByBaseCurrency).forEach((key) => {
    const group = groupedByBaseCurrency[key];
    const baseTokenAddress = key;
    const tokenInfo = group[0].baseCurrency;
    updateTokenData(baseTokenAddress, tokenInfo, group, collection);
  });
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

  app.get('/velas/token/:id', async (req, res) => {
    try {
      return res.send(await priceCollection.get(req.params.id));
    } catch (e) {
      console.error(e);
    }
  });

  updateData(priceCollection);
  //
  // cron.schedule('30 0-59 * * * *', () => {
  //   TOKENS_TO_INDEX_PRICE.forEach((i) => updatePrice(i, priceCollection));
  // });
};
