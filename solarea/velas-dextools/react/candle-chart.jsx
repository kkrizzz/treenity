const TradingView = render('dev', 'trading-view');

function loadKlines(symbolInfo, resolution, from, to) {
  // console.log(symbolInfo, resolution, from, to);
  const { base, quote } = symbolInfo;
  return fetch(`/api/velas/klines/${base}/${quote}?from=${from}&to=${to}&interval=${resolution}`)
    .then((res) => res.json())
    .then((klines) => {
      klines.forEach((k, index) => {
        const interMs = +resolution * 60 * 1000;
        const prev = klines[index - 1];

        k.open = prev ? prev.close : k.open;
        k.time = new Date(k._id * interMs).getTime();
        k.volume = k.vol;
      });
      return klines;
    });
}

const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '240', '480', '1440', '10080', '43200'],
  exchanges: [],
  symbols_types: [
    {
      name: 'crypto',
      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'crypto',
    },
  ],
};

class Datafeed {
  // _markets = [];
  _market;
  _conf = {
    exchanges: [],
  };

  constructor(market, conf) {
    this._market = market;

    if (conf.exchanges) {
      this._conf.exchanges.push(...conf.exchanges);
    }
    // this._markets = markets;
  }

  async getBars(symbolInfo, resolution, { from, to }, onHistoryCallback, onErrorCallback) {
    try {
      const klines = await loadKlines(symbolInfo, resolution, from, to);

      const noData = klines.length === 0;
      onHistoryCallback(klines, { noData });
    } catch (err) {
      onErrorCallback(err);
    }
  }

  onReady(callback) {
    setTimeout(() => callback(configurationData));
  }

  async resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    // console.log('[resolveSymbol]: Method call', symbolName);
    // const symbolDesc = this._markets.find((symbol) => symbol.symbol === symbolName);
    // if (!symbolDesc) {
    //   console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
    //   onResolveErrorCallback('cannot resolve symbol');
    //   return;
    // }

    // const symbolDesc

    const tickSize = 0.000001;

    const precision = -Math.log10(tickSize);
    const symbolInfo = {
      ticker: symbolName,
      name: symbolName,
      base: this._market.base,
      quote: this._market.quote,
      description: `Velas ${symbolName} market`,
      type: 'bitcoin',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: 'Wag',
      minmov: 1,
      pricescale: 1 / tickSize,
      has_intraday: true,
      has_no_volume: false,
      has_weekly_and_monthly: false,
      volume_precision: precision,
      data_status: 'streaming',
    };

    console.log('[resolveSymbol]: Symbol resolved', symbolName);
    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  }

  unsubscribeBars(...args) {
    console.log('unsubscribeBars', ...args);
  }
}

add(({ token, base, quote }) => {
  const datafeed = React.useMemo(() => new Datafeed({ base, quote }, configurationData), [
    base,
    quote,
  ]);

  return <TradingView token={token} datafeed={datafeed} />;
});
