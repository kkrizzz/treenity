import scheduleUpdates from './cron';
import updateTokensData from './dex-trades';
import updateLiquidityData from './pool-liquidity';
import applyRoutes from './routes';
import subscribeEvmLogs from './ws-logs-subscribe';
import updateTheGraphTrades from './dex-trades-thegraph';
import updateTokenData from './the-graph-token-data-indexer';

export const indexVelasDextools = async (app) => {
  const priceCollection = app.collection('velas-dextools');
  app.collection('velas-dextools-pools');
  const liquidityCollection = app.collection('velas-dextools-liquidity');
  app.collection('velas-dextools-thegraph-swaps');

  priceCollection.Model.createIndex({
    'base.address': 1,
    'quote.address': 1,
    time: 1,
  });

  liquidityCollection.Model.createIndex({
    tokenA: 1,
    tokenB: 1,
    time: -1,
  });

  // while (await updateTheGraphTrades(app));

  // updateTokensData(app).catch(console.error);
  await updateLiquidityData(app);

  updateTokenData(app).catch(console.error);

  scheduleUpdates(app);

  applyRoutes(app);

  // subscribeEvmLogs();
};
