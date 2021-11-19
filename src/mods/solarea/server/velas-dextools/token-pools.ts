import sumBy from 'lodash/sumBy';
import { fetchVelasTheGraph } from './utils';

const QUERY = `
query ($skip: Int!, $first: Int=1000) {
  pairs(first: $first, skip: $skip, orderBy:timestamp, orderDirection: asc) {
    _id: id
    name
    token0 {
      address: id
      symbol
      name
      decimals
    }
    token1 {
      address: id
      symbol
      name
      decimals
    }
    pairHourData(first: 24, orderBy:hourStartUnix, orderDirection:desc) {
      hourlyVolumeUSD
      hourlyTxns
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

async function updateTokenPools(app) {
  const poolsCollection = app.services['velas-dextools-pools'].Model;
  const tokensCollection = app.services['velas-dextools-tokens'].Model;
  let skip = 0;
  let pairs;

  const tokens = await tokensCollection.find({}).toArray();

  while (true) {
    ({ pairs } = await fetchVelasTheGraph(QUERY, { skip }));
    if (!pairs.length) break;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      // calc token kind
      const token0 = tokens.find((t) => t._id === pair.token0.address);
      const token1 = tokens.find((t) => t._id === pair.token1.address);
      const token0Kind = token0?.kind ?? 1;
      const token1Kind = token1?.kind ?? 1;
      const kind = Math.min(token0Kind, token1Kind);

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
        dailyVolumeUSD: sumBy(pair.pairHourData, (d: any) => parseFloat(d.hourlyVolumeUSD)),
        dailyTxns: sumBy(pair.pairHourData, (d: any) => parseFloat(d.hourlyTxns)),
        kind,
      };
      const result = await poolsCollection.replaceOne({ _id: pair._id }, item);
      if (!result.result.nModified) {
        item._id = pair._id;
        await poolsCollection.insertOne(item);
      }
    }

    skip += pairs.length;
  }
}

export default updateTokenPools;
