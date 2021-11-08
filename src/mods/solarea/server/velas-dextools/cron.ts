const cron = require('node-cron');

import updateTokenData from './the-graph-token-data-indexer';
import updateLiquidityData from './pool-liquidity-thegraph';
import updateTokensData from './dex-trades';
import updateTheGraphTrades from './dex-trades-thegraph';
import updateTokenPools from './token-pools';

export default function scheduleUpdates(app) {
  cron.schedule('*/30 * * * * *', async () => {
    await updateLiquidityData(app).catch((err) => {
      console.error('Velas Pool Liquidity update', err);
      throw err;
    });
  });
  cron.schedule('*/30 * * * * *', async () => {
    await updateTokenData(app).catch((err) => {
      console.error('Velas Tokens data update', err);
      throw err;
    });
  });
  cron.schedule('*/5 * * * * *', async () => {
    await updateTheGraphTrades(app).catch((err) => {
      console.error('Velas Pool Liquidity update', err);
      throw err;
    });
    // TOKENS_TO_INDEX_PRICE.forEach((i) => updatePrice(i, priceCollection));
  });
  cron.schedule('0 * * * * *', async () => {
    await updateTokenPools(app).catch((err) => {
      console.error('Velas Pools update', err);
      throw err;
    });
  });
}
