const fetch = require('node-fetch');

const dataFromServer = {
  headers: {
    accept: 'application/json',
    'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    pragma: 'no-cache',
    'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    cookie:
      'amp_fef1e8=da0e3634-6b25-4f96-9f16-e1dcad1ff822R...1fjctllar.1fjctllb7.1.1.2; _ga_0JZ9C3M56S=GS1.1.1635742577.1.1.1635742577.0; _gid=GA1.2.588682984.1635915780; _ga=GA1.1.1475092724.1635412992; _ga_334KNG3DMQ=GS1.1.1636012051.13.1.1636015745.58',
    Referer: 'https://thegraph.wagyuswap.app/subgraphs/name/wagyu/graphql',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
  body:
    '{"query":"query($address: ID!) {\\n  token(id: $address) {\\n    symbol\\n    derivedUSD\\n    tradeVolumeUSD\\n  }\\n}","variables":{"address":"0xabf26902fd7b624e0db40d31171ea9dddf078351"}}',
  method: 'POST',
};

const tokenDataQuery = `
query {
  tokens {
    address: id
    symbol
    derivedUSD
    tradeVolumeUSD
  }
}`;

const loadTokenData = async () => {
  const tokenData = await fetch('https://thegraph.wagyuswap.app/subgraphs/name/wagyu', {
    method: 'POST',
    cache: 'no-cache',
    headers: dataFromServer.headers,
    body: JSON.stringify({ query: tokenDataQuery }),
  })
    .then((res) => res.json())
    .catch(console.log);

  return tokenData.data.tokens;
};

export default async function updateTokenData(app) {
  const collection = app.services['velas-dextools-token-data'];

  const newTokens = await loadTokenData();
  await collection.Model.remove({});
  await collection.Model.insertMany(newTokens);
}
