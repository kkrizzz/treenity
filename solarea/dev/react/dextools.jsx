const tradingView = await require('/charting_library/charting_library.standalone.js');
const LastTrades = render('dev', 'last-trades');

const configurationData = {
  supported_resolutions: ['1', '5', '15', '30', '60', '240', '480', '1440', '10080', '43200'],
  exchanges: [
    {
      value: 'Serum',
      name: 'Serum',
      desc: 'Serum Solana Exchange',
    },
  ],
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

  constructor(market) {
    this._market = market;
    // this._markets = markets;
  }

  async getBars(symbolInfo, resolution, { from, to }, onHistoryCallback, onErrorCallback) {
    console.log('getBars', arguments);
    try {
      const klines = await loadKlines(symbolInfo, resolution, from, to);
      klines.forEach((k) => {
        const interMs = +resolution * 60 * 1000;
        k.time = new Date(k._id * interMs).getTime();
        k.volume = k.vol;
      });

      onHistoryCallback(klines, { noData: false });
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

    const tickSize = 0.001;

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
}

function loadKlines(symbolInfo, resolution, from, to) {
  console.log(symbolInfo, resolution, from, to);
  const { base, quote } = symbolInfo;
  return fetch(
    `/velas/klines/${base.address}/${quote.address}?from=${from}&to=${to}&interval=${resolution}`,
  ).then((res) => res.json());
}

function useLoadMarkets(token) {
  return solarea.useQuery([token, 'markets'], () =>
    fetch(`/velas/token/${token}/markets`).then((res) => res.json()),
  );
}

const TradingViewComponent = ({ market }) => {
  const widget = React.useRef();
  React.useLayoutEffect(() => {
    const token = `${market.base.symbol}/${market.quote.symbol}`;

    widget.current = new TradingView.widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      symbol: token,
      interval: '1',
      datafeed: new Datafeed(market),
      container: 'tv_chart_container',
      library_path: '/charting_library/',
      locale: 'en',
      // enabled_features: ['study_templates'],
      disabled_features: [
        'left_toolbar',
        // 'header_widget',
        // 'control_bar',
        // 'timeframes_toolbar',
        'legend_widget',
      ],
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      load_last_chart: true,
      width: '100%',
    });
  }, [market]);

  return <div style={{ width: '100%' }} id="tv_chart_container"></div>;
};

add(({ token }) => {
  const { data: markets, isLoading: isMarketsLoading } = useLoadMarkets(token);

  if (isMarketsLoading) return <div>Loading markets ...</div>;

  const [currentMarket, setMarket] = React.useState(markets[0]);

  return (
    <div>
      <select
        style={{ color: 'black' }}
        onChange={(e) => setMarket(markets.find((m) => m.market === e.currentTarget.value))}
      >
        {markets.map((m) => (
          <option value={m.market}>
            {m.base.symbol}/{m.quote.symbol}
          </option>
        ))}
      </select>
      {currentMarket && <TradingViewComponent market={currentMarket} />}
      {currentMarket && <LastTrades market={currentMarket.market} />}
    </div>
  );
});
