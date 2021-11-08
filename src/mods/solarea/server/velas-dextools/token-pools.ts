// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
const PIPELINE = [
  // Stage 2
  {
    $sort: {
      time: 1,
    },
  },
  {
    $group: {
      _id: { base: '$base.address', quote: '$quote.address' },
      base: { $last: '$base' },
      quote: { $last: '$quote' },
      createdAt: { $first: '$time' },
      amountUSD: { $last: '$amountUSD' },
      amountA: { $last: '$amount' },
      amountB: { $last: '$amountB' },
      market: { $last: '$market' },
    },
  },
  {
    $out: 'velas-dextools-pools',
  },
];

export default async function updateTokenPools(app) {
  const priceCollection = app.services['velas-dextools-thegraph-swaps'];

  await priceCollection.Model.aggregate(PIPELINE).next();
}
