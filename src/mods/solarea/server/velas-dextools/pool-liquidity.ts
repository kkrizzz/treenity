import * as _ from 'lodash';

const fetch = require('node-fetch');

const tokenInfoQuery = `
query ($after: ISO8601DateTime!) {
  ethereum(network: velas) {
    smartContractCalls(
      smartContractMethod: {in: ["addLiquidity", "addLiquidityETH", "removeLiquidity", "removeLiquidityETH", "removeLiquidityWithPermit", "removeLiquidityETHWithPermit"]}
      options: {}
      smartContractAddress: {is: "0x93848497Fe87da12a9F3E213b8445d9712257558"}
      time: {after: $after, till: null}
    ) {
      smartContractMethod {
        name
        signature
      }
      arguments {
        argument
        value
      }
      block {
        timestamp {
          unixtime
        }
      }
      transaction {
        txFrom {
          address
        }
        hash
      }
    }
  }
}
`;

export default async function updateLiquidityData(app) {
  const collection = app.services['velas-dextools-liquidity'];

  const lastEntry = (await collection.find({ options: { sort: { time: -1 }, limit: 1 } }))?.[0];
  const lastEntryTime = lastEntry?.time;
  const after =
    (lastEntryTime
      ? new Date(lastEntryTime.getTime() + 1000).toISOString()
      : '2021-10-10T00:00:00.000Z'
    ).slice(0, -5) + 'Z';

  const params = { query: tokenInfoQuery, variables: { after } };
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
  const calls = bitQueryResult.data.ethereum.smartContractCalls;

  for (let i = 0; i < calls.length; i++) {
    const call = calls[i];
    const method = call.smartContractMethod.name;
    const tx = call.transaction;

    const entry: any = {
      type: method.startsWith('add') ? 'add' : 'remove',
      time: new Date(call.block.timestamp.unixtime * 1000),
      hash: tx.hash,
      from: tx.txFrom.address,
    };
    call.arguments.reduce((o, arg) => ((o[arg.argument] = arg.value), o), entry);

    if (method.includes('ETH')) {
      entry.tokenA = '0x485f49e0764c305dc6fc1da2e5b786f65f8c95aa';
      entry.tokenB = entry.token;
      entry.amountAMin = entry.amountETHMin;
      entry.amountBMin = entry.amountTokenMin;
      entry.amountADesired = entry.amountETHMin;
      entry.amountBDesired = entry.amountTokenDesired;

      delete entry.token;
      delete entry.amountETHMin;
      delete entry.amountTokenMin;
      delete entry.amountTokenDesired;
    }

    await collection.create(entry);
  }
}
