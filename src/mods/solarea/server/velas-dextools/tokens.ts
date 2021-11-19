import { fetchVelasTheGraph } from './utils';

const QUERY = `
query ($skip: Int!, $first: Int=1000) {
  tokens(first:$first, skip:$skip) {
    address: id
    name
    symbol
    decimals
    totalLiquidity
    totalTransactions
    derivedUSD
    tradeVolumeUSD
  }
}
`;

async function updateTokens(app) {
  const tokensCollection = app.services['velas-dextools-tokens'].Model;
  let skip = 0;
  let tokens;

  while (true) {
    ({ tokens } = await fetchVelasTheGraph(QUERY, { skip }));
    if (!tokens.length) break;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      const item = {
        ...token,
        totalLiquidity: parseFloat(token.totalLiquidity),
        derivedUSD: parseFloat(token.derivedUSD),
        tradeVolumeUSD: parseFloat(token.tradeVolumeUSD),
        totalTransactions: parseInt(token.totalTransactions),
        decimals: parseInt(token.decimals),
      };

      const result = await tokensCollection.updateOne({ _id: item.address }, { $set: item });
      if (!result.matchedCount) {
        let kind = 1;
        if (/test/i.test(item.name)) {
          // filter out tokens with 'test' in name
          kind = 0;
        }
        item._id = item.address;
        item.kind = kind;
        await tokensCollection.insertOne(item);
      }
    }

    skip += tokens.length;
  }
}

export default updateTokens;
