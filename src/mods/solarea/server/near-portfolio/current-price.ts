import { Application } from '@feathersjs/express';
const fetch = require('node-fetch');
const pools = require('./ref-pools.json');

export function currentPrice(app: Application) {
  const priceCollection = app.services['near-token-price'];
  app.get('/api/near/price/:contractId', async (req, res) => {
    try {
      const { contractId } = req.params;
      if (!contractId) return res.sendStatus(500);

      const pool = pools.find((i) =>
        i.id <= 64 ? i.tokens[0].contractId === contractId : i.tokens[1].contractId === contractId,
      );
      const needRevert = pool.id >= 64;

      const token = needRevert ? pool.tokens[1] : pool.tokens[0].token;
      const symbol = token.symbol;

      const hasPrice = await priceCollection.get(symbol);
      if (hasPrice) return res.send(hasPrice);

      const filter = JSON.stringify({ poolId: pool.id });
      const tokenPrices = await fetch(
        `https://ref.nearchaintools.com/api/pool-tokens?filter=${encodeURI(filter)}`,
      ).then((res) => res.json());

      const currentTokenPrices = tokenPrices[0].token2.prices;
      const currentTokenPrice = currentTokenPrices[currentTokenPrices.length - 1];

      const tokenData = {
        _id: token.symbol,
        info: token,
        price: currentTokenPrice,
        prices: currentTokenPrices,
        date: new Date(),
      };

      res.send(tokenData);
    } catch (e) {
      res.sendStatus(500);
    }
  });
}
