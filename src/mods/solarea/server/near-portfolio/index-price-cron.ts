import * as _ from 'lodash';

const cron = require('node-cron');
const pools = require('./ref-pools.json');
const fetch = require('node-fetch');

const TOKENS_TO_INDEX_PRICE = [
  'token.skyward.near',
  'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near',
  'token.v2.ref-finance.near',
  'f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near',
  'berryclub.ek.near',
];

export const updatePrice = async (contractId, collection) => {
  const pool = pools.find((i) =>
    i.id <= 64 ? i.tokens[0].contractId === contractId : i.tokens[1].contractId === contractId,
  );

  const needRevert = pool.id >= 64; //kek

  const filter = JSON.stringify({ poolId: pool.id });
  const tokenPrices = await fetch(
    `https://ref.nearchaintools.com/api/pool-tokens?filter=${encodeURI(filter)}`,
  ).then((res) => res.json());

  const currentTokenPrices = tokenPrices[0].token2.prices;
  const currentTokenPrice = currentTokenPrices[currentTokenPrices.length - 1];

  const token = needRevert ? pool.tokens[1].token : pool.tokens[0].token;
  const tokenData: any = {
    _id: token.symbol,
    info: token,
    price: currentTokenPrice,
    prices: currentTokenPrices,
    date: new Date(),
  };

  const dayInterval = 86400000;
  const hourInterval = Math.floor(dayInterval / 6);

  tokenData.prices.forEach((price) => {
    price.group = Number((price.timestamp / hourInterval).toFixed(0));
  });

  const grouped = _.groupBy(tokenData.prices, 'group');

  const candles = Object.keys(grouped).map((key, index) => {
    const group = grouped[key];
    const number = Number(key);

    return {
      time: (number * hourInterval) / 1000,
      open: index !== 0 ? _.last(grouped[number - 1]).price : _.head(group).price,
      high: _.maxBy(group, 'price').price,
      low: _.minBy(group, 'price').price,
      close: _.last(group).price,
    };
  });

  tokenData.candles = candles;

  let hasPrice = false;

  try {
    hasPrice = await collection.get(token.symbol);
  } catch (e) {}

  if (hasPrice) {
    await collection.patch(token.symbol, tokenData);
  } else {
    await collection.create(tokenData);
  }

  console.log('update price: ' + token.symbol);
};

export const indexPriceCron = (app) => {
  const priceCollection = app.services['near-token-price'];

  TOKENS_TO_INDEX_PRICE.forEach((i) => updatePrice(i, priceCollection));
  //
  // cron.schedule('30 0-59 * * * *', () => {
  //   TOKENS_TO_INDEX_PRICE.forEach((i) => updatePrice(i, priceCollection));
  // });
};
