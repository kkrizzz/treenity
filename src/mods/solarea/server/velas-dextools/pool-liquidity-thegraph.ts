import { fetchVelasTheGraph } from './utils';

const FIELDS = `
    amount0
    amount1
    amountUSD
    sender
    timestamp
    transaction {
      id
    }
    pair {
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
    }
`;

const OPTIONS = `orderBy: timestamp, orderDirection: asc, first: $limit, where: { timestamp_gt:$after }`;
const tokenInfoQuery = `
query ($after: BigInt!, $limit: Int) {
  burns(${OPTIONS}) {
    ${FIELDS}
  } 
  mints(${OPTIONS}) {
    ${FIELDS}
  } 
}
`;

export default async function updateLiquidityData(app) {
  const collection = app.services['velas-dextools-liquidity'];

  const lastEntry = await collection.Model.findOne({}, { sort: { time: -1 } });
  const lastEntryTime = lastEntry?.time || new Date('2021-10-31T20:00:00.000Z');
  const after = Math.floor(lastEntryTime.getTime() / 1000);
  const { burns, mints } = await fetchVelasTheGraph(tokenInfoQuery, { after, limit: 1000 });

  const createMany = async (calls, type) => {
    if (!calls.length) return;

    const toInsert = calls.map((call) => {
      const entry: any = {
        type,
        time: new Date(call.timestamp * 1000),
        hash: call.transaction.id,
        from: call.sender,
        tokenA: call.pair.token0,
        tokenB: call.pair.token1,
        lastTradeAmountA: parseFloat(call.amount0),
        lastTradeAmountB: parseFloat(call.amount1),
        lastTradeAmountUSD: parseFloat(call.amountUSD),
      };

      return entry;
    });

    await collection.Model.insertMany(toInsert);
  };

  await createMany(burns, 'remove');
  await createMany(mints, 'add');

  return burns.length + mints.length > 10;
}
