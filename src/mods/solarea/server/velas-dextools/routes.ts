import memoize from 'lodash/memoize';

const CachedLookup = require('cached-lookup');

async function aggregateCandles(priceCollection, base, quote, from, to, interval) {
  const inter = interval * 1000 * 60;
  from = new Date(Math.ceil(from.getTime() / inter) * inter);

  return await priceCollection.Model.aggregate([
    {
      $match: {
        'base.address': base,
        'quote.address': quote,
        time: { $gte: from, $lte: to },
      },
    },
    {
      $project: {
        frame: {
          $trunc: {
            $divide: [{ $subtract: ['$time', new Date('1970-01-01')] }, inter],
          },
        },
        time: 1,
        qp: 1,
        amount: 1,
      },
    },
    { $sort: { time: 1 } },
    {
      $group: {
        _id: '$frame',
        time: { $first: '$time' },
        open: { $first: '$qp' },
        close: { $last: '$qp' },
        high: { $max: '$qp' },
        low: { $min: '$qp' },
        vol: { $sum: '$amount' },
      },
    },
    { $sort: { time: 1 } },
  ]).toArray();
}

async function calc24PriceChange(priceCollection, quote, base) {
  let latestMarketTrade = await priceCollection.Model.findOne(
    {
      'base.address': base,
      'quote.address': quote,
    },
    { sort: { time: -1 } },
  );

  const latestMarketTrade24hrAgoDate = new Date();
  latestMarketTrade24hrAgoDate.setDate(latestMarketTrade24hrAgoDate.getDate() - 1); // yesterday

  let trade24hrAgo = await priceCollection.Model.findOne(
    {
      'base.address': base,
      'quote.address': quote,
      time: { $gte: latestMarketTrade24hrAgoDate },
    },
    { sort: { time: 1 } },
  );

  trade24hrAgo = trade24hrAgo || latestMarketTrade;
  const price = latestMarketTrade ? trade24hrAgo.qp - latestMarketTrade.qp : 0;
  const percent = latestMarketTrade ? (price / latestMarketTrade.qp) * 100 : 0;
  return {
    price,
    percent,
  };
}

export default async function applyRoutes(app) {
  const priceCollection = app.services['velas-dextools-thegraph-swaps'];
  const poolsCollection = app.services['velas-dextools-pools'];
  const liquidityCollection = app.services['velas-dextools-liquidity'];
  const tokenCollection = app.services['velas-dextools-token-data'];

  app.get('/api/velas/token/:token/:base/data', async (req, res) => {
    const { token, base } = req.params;
    if (!token) return res.status(404).send('No token name provided');

    const tokenData = await tokenCollection.Model.findOne({ address: token });

    const changeData = await calc24PriceChange(priceCollection, token, base);
    tokenData.priceChange = changeData.price;
    tokenData.percentChange = changeData.percent;

    return res.send(tokenData);
  });

  app.get('/api/velas/poollist', async (req, res) => {
    try {
      res.send(await poolsCollection.Model.find().toArray());
    } catch (e) {
      res.statusCode(500).send('Pool list not found');
    }
  });

  app.get('/api/velas/importantactions', async (req, res) => {
    const { limit = 0 } = req.query;

    try {
      const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const latestBigSwaps = await priceCollection.Model.find(
        { amountUSD: { $gte: 1000 }, time: { $gte: fromDate }, side: 'SELL' },
        { limit: Number(limit), sort: { amountUSD: -1 } },
      ).toArray();

      const latestNewPools = await poolsCollection.Model.find(
        { createdAt: { $gte: fromDate } },
        { limit: Number(limit), sort: { createdAt: -1 } },
      ).toArray();

      latestBigSwaps.forEach((i) => (i.actionType = 'bigSwap'));
      latestNewPools.forEach((i) => (i.actionType = 'newPool'));

      let filteredPools: any = [];

      latestNewPools.forEach((pool) => {
        const inFilteredArrayIndex = filteredPools.findIndex((item) => {
          const inLabel = [item.base.address, item.quote.address];
          return inLabel.includes(pool.base.address) && inLabel.includes(pool.quote.address);
        });
        if (inFilteredArrayIndex === -1) filteredPools.push(pool);
      });

      const actions = latestBigSwaps.concat(filteredPools).sort((a, b) => {
        const aTime = a.time || a.createdAt;
        const bTime = b.time || b.createdAt;

        return bTime - aTime;
      });

      res.send(actions);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });

  app.get('/api/velas/market/:quote/:base/liquidity', async (req, res) => {
    const { base, quote } = req.params;
    const { limit, offset = 0 } = req.query;

    const liquidity = await liquidityCollection.Model.find(
      {
        $or: [
          { 'tokenA.address': quote, 'tokenB.address': base },
          { 'tokenA.address': base, 'tokenB.address': quote },
        ],
      },
      { sort: { time: -1 }, limit: parseInt(limit), offset: parseInt(offset) },
    ).toArray();

    res.send(liquidity);
  });

  app.get('/api/velas/token/hot', async (req, res) => {
    const hottestPairs24hr = await priceCollection.Model.aggregate([
      {
        $match: {
          time: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            base_symbol: '$base.symbol',
            base_address: '$base.address',
            quote_symbol: '$quote.symbol',
            quote_address: '$quote.address',
          },
          price: { $last: '$qp' },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 20,
      },
    ]).toArray();

    let filteredPairs: any = [];

    hottestPairs24hr.forEach((pair) => {
      const inFilteredArrayIndex = filteredPairs.findIndex((item) => {
        const inLabel = [item._id.base_address, item._id.quote_address];
        return inLabel.includes(pair._id.base_address) && inLabel.includes(pair._id.quote_address);
      });
      if (inFilteredArrayIndex === -1) filteredPairs.push(pair);
    });

    res.send(filteredPairs);
  });

  // app.get('/api/velas/market/add', async (req, res) => {
  //   await priceCollection.Model.insertOne({
  //     qp: Math.random() * 10,
  //     amount: Math.random() * 100,
  //     time: new Date(),
  //     market: '0x1e4cf38d767364bff986658c620302010d338bf0',
  //     exchange: '0x90594eaff8567c16cf27528181d99a125b8d5cf3',
  //     base: {
  //       decimals: 18,
  //       symbol: 'WAG',
  //       address: '0x40c8002c2887ade2297ad48d9dc101de08bd104c',
  //     },
  //     quote: {
  //       decimals: 18,
  //       symbol: 'WVLX',
  //       address: '0x485f49e0764c305dc6fc1da2e5b786f65f8c95aa',
  //     },
  //     side: Math.random() >= 0.5 ? 'SELL' : 'BUY',
  //     tx: {
  //       hash: '0x5413609763ed20b700e0f0dc6b3905f7fbd8223a5c05a37b4678cbf6bab936ea',
  //       from: {
  //         address: '0x3812d358fd62667db446e2b895422b762bab690f',
  //       },
  //     },
  //   });
  //
  //   return res.send('Its ok');
  // });

  app.get('/api/velas/market/:base/:quote/lastkline', async (req, res) => {
    try {
      const { base, quote } = req.params;
      const { interval = 1 } = req.query;

      const nowDate = new Date();
      const fromDate = new Date(nowDate.getTime() - Number(interval) * 1000 * 60);

      const candles = await aggregateCandles(
        priceCollection,
        base,
        quote,
        fromDate,
        nowDate,
        interval,
      );

      res.send(candles);
    } catch (e) {
      res.statusCode(404).send('Last candles not found');
    }
  });

  app.get('/api/velas/market/:quote/:base/trades', async (req, res) => {
    const { base, quote } = req.params;
    const { offset } = req.query;

    const trades = await priceCollection.Model.find(
      { 'base.address': base, 'quote.address': quote },
      { sort: { time: -1 }, limit: 100, offset },
    ).toArray();

    res.send(trades);
  });

  app.get('/api/velas/klines/:quote/:base', async (req, res) => {
    try {
      const { base, quote } = req.params;
      const { from, to, interval = 1 } = req.query;

      const fromDate = new Date((from || 0) * 1000);
      const toDate = to ? new Date(to * 1000) : new Date();

      const klines = await aggregateCandles(
        priceCollection,
        base,
        quote,
        fromDate,
        toDate,
        interval,
      );
      return res.send(klines);
    } catch (e) {
      console.error(e);
    }
  });

  function cacheResults(resolver, paramResolver, timeout) {
    const memoizer = memoize(
      (params, res) => {
        return new CachedLookup(() => resolver(params, res));
      },
      (params, res) => JSON.stringify(params),
    );

    return async (req, res) => {
      const params = paramResolver(req, res);
      try {
        const result = await memoizer(params, res).cached(timeout);
        res.send(result);
      } catch (err) {
        res.sendStatus(500);
      } finally {
        res.end();
      }
    };
  }

  const getMarkets = async ({ token }) => {
    if (!token) throw new Error('token must be specified');

    let markets = await poolsCollection.Model.find({
      $or: [{ 'base.address': token }, { 'quote.address': token }],
    }).toArray();

    markets = markets.map((m) => {
      if (m.base.address === token) return m;

      return {
        ...m,
        base: m.quote,
        quote: m.base,
        amountA: m.amountB,
        amountB: m.amountA,
        volumeA: m.volumeB,
        volumeB: m.volumeA,
        priceA: m.priceB,
        priceB: m.priceA,
      };
    });

    return markets;
  };
  app.get(
    '/api/velas/token/:token/markets',
    cacheResults(
      getMarkets,
      (req) => ({
        token: req.params.token,
      }),
      5000,
    ),
  );
}
