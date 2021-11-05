const cron = require('node-cron');

import updateLiquidityData from './pool-liquidity';
import updateTokensData from './dex-trades';
import updateTheGraphTrades from './dex-trades-thegraph';

export default function scheduleUpdates(app) {
  cron.schedule('*/30 * * * * *', async () => {
    await updateLiquidityData(app).catch((err) => {
      console.error('Velas Pool Liquidity update', err);
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
}
