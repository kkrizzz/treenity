import * as _ from 'lodash';

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
  ethereum(network: velas) {
    smartContractCalls(
      smartContractMethod: {in: ["addLiquidity", "addLiquidityETH", "removeLiquidity", "removeLiquidityETH"]}
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
    }
  }
}
`;

export default async function updateLiquidityData(app) {
  const collection = app.services['velas-dextools-liqudity'];

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

    const entry: any = {
      type: method.startsWith('add') ? 'add' : 'remove',
      time: new Date(call.block.timestamp.unixtime * 1000),
    };
    call.arguments.reduce((o, arg) => ((o[arg.argument] = arg.value), o), entry);

    if (method.endsWith('ETH')) {
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
