const fetch = require('node-fetch');

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

  const params = { query: tokenInfoQuery, variables: { after, limit: 1000 } };
  const tokenDataFetch = await fetch('https://thegraph.wagyuswap.app/subgraphs/name/wagyu', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (tokenDataFetch.status !== 200) {
    throw new Error(`TheGraph: ${tokenDataFetch.status}, ${tokenDataFetch.statusText}`);
  }
  const bitQueryResult = await tokenDataFetch.json();
  const { burns, mints } = bitQueryResult.data;

  const createMany = async (calls, type) => {
    const toInsert = calls.map((call) => {
      const entry: any = {
        type,
        time: new Date(call.timestamp * 1000),
        hash: call.transaction.id,
        from: call.sender,
        tokenA: call.pair.token0,
        tokenB: call.pair.token1,
        amountA: parseFloat(call.amount0),
        amountB: parseFloat(call.amount1),
        amountUSD: parseFloat(call.amountUSD),
      };

      return entry;
    });

    await collection.Model.insertMany(toInsert);
  };

  await createMany(burns, 'remove');
  await createMany(mints, 'add');

  return burns.length + mints.length > 10;
}
