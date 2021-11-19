import scheduleUpdates from './cron';
import updateLiquidityData from './pool-liquidity-thegraph';
import applyRoutes from './routes';
// import subscribeEvmLogs from './ws-logs-subscribe';
import updateTheGraphTrades from './dex-trades-thegraph';
import updateTokenPools from './token-pools';
import updateTokens from './tokens';

export const indexVelasDextools = async (app) => {
  const priceCollection = app.collection('velas-dextools');
  app.collection('velas-dextools-pools');
  const liquidityCollection = app.collection('velas-dextools-liquidity');
  app.collection('velas-dextools-thegraph-swaps');
  app.collection('velas-dextools-tokens');

  priceCollection.Model.createIndex({
    'base.address': 1,
    'quote.address': 1,
    time: 1,
  });
  priceCollection.Model.createIndex({
    'base.address': 1,
    'quote.address': 1,
    time: -1,
  });
  priceCollection.Model.createIndex({
    market: 1,
    time: -1,
  });

  liquidityCollection.Model.createIndex({
    tokenA: 1,
    tokenB: 1,
    time: -1,
  });

  applyRoutes(app);

  await updateTokens(app);
  while (await updateTheGraphTrades(app));
  while (await updateLiquidityData(app));
  await updateTokenPools(app);

  scheduleUpdates(app);

  // subscribeEvmLogs();
};
