// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
import { fetchVelasTheGraph } from './utils';

const QUERY = `
query ($after: BigInt!, $first: Int=1000) {
  pairs(first: $first, where: {timestamp_gt:$after}, orderBy:timestamp, orderDirection: asc) {
    _id: id
    name
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }
    totalSupply
    totalTransactions
    token0Price
    token1Price
    volumeToken0
    volumeToken1
    reserve0
    reserve1
    reserveUSD
    volumeUSD
    untrackedVolumeUSD
    timestamp
  }
}
`;

export default async function updateTokenPools(app) {
  const poolsCollection = app.services['velas-dextools-pools'].Model;
  let after = 0;
  let pairs;
  while (true) {
    ({ pairs } = await fetchVelasTheGraph(QUERY, { after }));
    if (!pairs.length) break;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const item: any = {
        name: pair.name,
        base: pair.token0,
        quote: pair.token1,
        createdAt: new Date(pair.timestamp * 1000),
        amountUSD: pair.reserveUSD,
        amountA: pair.reserve0,
        amountB: pair.reserve1,
        volumeA: pair.volumeToken0,
        volumeB: pair.volumeToken1,
        market: pair._id,
        priceA: pair.token0Price,
        priceB: pair.token1Price,
        txs: pair.totalTransactions,
        supply: pair.totalSupply,
      };
      const result = await poolsCollection.replaceOne({ _id: pair._id }, item);
      if (!result.result.nModified) {
        item._id = pair._id;
        await poolsCollection.insertOne(item);
      }
    }

    after = pairs[pairs.length - 1].timestamp;
  }
}
