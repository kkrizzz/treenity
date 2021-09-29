const tradingView = await require('http://localhost:5000/charting_library/charting_library.standalone.js');

class Datafeed {
  _markets = [];

  constructor(markets) {
    this._markets = markets;
  }

  async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) {
    try {
      const klines = await loadKlines(symbolInfo, resolution, from, to);

      onHistoryCallback(klines, { noData: false });
    } catch (err) {
      onErrorCallback(err);
    }
  }

  async resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    console.log('[resolveSymbol]: Method call', symbolName);
    const symbolDesc = this._markets.find((symbol) => symbol.symbol === symbolName);
    if (!symbolDesc) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }

    const tickSize = 0.001;

    const precision = -Math.log10(tickSize);
    const symbolInfo = {
      ticker: symbolDesc.symbol,
      name: symbolDesc.symbol,
      description: `Velas ${symbolDesc.symbol} market`,
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
    onSymbolResolvedCallback(symbolInfo);
  }
}

add(({ token }) => {
  const { data: markets, isLoading: isMarketsLoading } = solarea.useQuery([token, 'markets'], () =>
    fetch(`/velas/token/${token}/markets`).then((res) => res.json()),
  );

  if (isMarketsLoading) return <div>Loading markets ...</div>;
  console.log(markets);
  //
  // React.useLayoutEffect(() => {
  //   var widget = (window.tvWidget = new TradingView.widget({
  //     // debug: true, // uncomment this line to see Library errors and warnings in the console
  //     fullscreen: true,
  //     interval: '30s',
  //     container: 'tv_chart_container',
  //     library_path: 'http://localhost:5000/charting_library/',
  //     locale: 'en',
  //     enabled_features: ['study_templates'],
  //     charts_storage_api_version: '1.1',
  //     client_id: 'tradingview.com',
  //     user_id: 'public_user_id',
  //   }));
  // });
  return (
    <div class="tv_chart_container">
      <div>Hello</div>
    </div>
  );
});

