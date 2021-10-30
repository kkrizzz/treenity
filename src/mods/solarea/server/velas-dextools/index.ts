import scheduleUpdates from './cron';
import updateTokensData from './tokens';
import updateLiquidityData from './pool-liquidity';
import applyRoutes from './routes';

export const indexVelasDextools = (app) => {
  const priceCollection = app.services['velas-dextools'];
  priceCollection.Model.createIndex({
    'base.address': 1,
    'quote.address': 1,
    time: 1,
  });

  const liquidityCollection = app.services['velas-dextools-liquidity'];
  liquidityCollection.Model.createIndex({
    tokenA: 1,
    tokenB: 1,
    time: -1,
  });

  updateTokensData(app).catch(console.error);
  updateLiquidityData(app).catch(console.error);

  scheduleUpdates(app);

  applyRoutes(app);
};
