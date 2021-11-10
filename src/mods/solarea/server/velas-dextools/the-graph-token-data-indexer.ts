import { fetchVelasTheGraph } from './utils';

const tokenDataQuery = `
query {
  tokens(first: 1000) {
    address: id
    symbol
    derivedUSD
    tradeVolumeUSD
  }
}`;

const loadTokenData = async () => {
  const { tokens } = await fetchVelasTheGraph(tokenDataQuery).catch(console.error);

  return tokens;
};

export default async function updateTokenData(app) {
  const collection = app.services['velas-dextools-token-data'];

  const newTokens = await loadTokenData();
  await collection.Model.remove({});
  await collection.Model.insertMany(newTokens);
}
