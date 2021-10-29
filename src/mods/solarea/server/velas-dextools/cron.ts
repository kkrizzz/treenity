const cron = require('node-cron');

import updateTokensData from './tokens';

export default function scheduleUpdates(app) {
  cron.schedule('*/30 * * * * *', async () => {
    await updateTokensData(app).catch((err) => {
      console.error('Velas klines update', err);
      throw err;
    });
    await updateTokensData(app).catch((err) => {
      console.error('Velas Pool Liquidity update', err);
      throw err;
    });
    // TOKENS_TO_INDEX_PRICE.forEach((i) => updatePrice(i, priceCollection));
  });
}
