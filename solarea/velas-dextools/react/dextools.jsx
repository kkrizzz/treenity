const LastTrades = render('velas-dextools', 'last-trades');
const TradingView = render('dev', 'trading-view');
const Hash = render('dev', 'hash');
const TokenData = render('velas-dextools', 'token-data');
const DashboardSection = render('dev', 'dashboard-section');
const DashboardCard = render('dev', 'dashboard-card');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');

const { useLatestTokenTrades } = await require('solarea://velas-dextools/utils');

function loadKlines(symbolInfo, resolution, from, to) {
  // console.log(symbolInfo, resolution, from, to);
  const { base, quote } = symbolInfo;
  return fetch(
    `/velas/klines/${base.address}/${quote.address}?from=${from}&to=${to}&interval=${resolution}`,
  )
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

function useLoadMarkets(token) {
  return solarea.useQuery([token, 'markets'], () =>
    fetch(`api/velas/token/${token}/markets`).then((res) => res.json()),
  );
}

add(({ token }) => {
  const { data: markets, isLoading: isMarketsLoading } = useLoadMarkets(token);

  if (isMarketsLoading) return <div>Loading markets ...</div>;
  if (!markets.length) return <div>Token markets not found</div>;

  const [currentMarket, setMarket] = React.useState(markets[0]);
  const datafeed = React.useMemo(() => new Datafeed(currentMarket, configurationData), [
    currentMarket,
  ]);

  const tokenPair = `${currentMarket.base.address}/${currentMarket.quote.address}`;
  const [trades, isLoadingTrades] = useLatestTokenTrades(tokenPair);

  useCSS(
    'dextools-custom-select',
    css`
      .dextools-custom-select select {
        background: transparent;
        border: none;
      }
      .dextools-custom-select select:active {
        border: none;
        box-shadow: none;
      }

      .dextools-custom-select select:focus {
        box-shadow: none;
      }
    `,
  );

  const priceChange24hrPercent = currentMarket.priceChange24hrPercent;
  const priceChange24hrValue = currentMarket.priceChange24hrValue;
  const isPriceFall = priceChange24hrPercent < 0;
  return (
    <div>
      <div class="bu-columns">
        <div class="bu-column" style={{ display: 'flex', alignItems: 'center' }}>
          <RandomImageWithNonce width={64} isEth address={currentMarket.base.address} />
          <div
            class="bu-is-size-5 bu-ml-4"
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <div>
              <div className="bu-select dextools-custom-select m-b-4">
                <select
                  style={{ color: 'black' }}
                  onChange={(e) =>
                    setMarket(markets.find((m) => m.market === e.currentTarget.value))
                  }
                >
                  {markets.map((m) => (
                    <option value={m.market}>
                      {m.base.symbol}/{m.quote.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Hash hash={currentMarket.base.address} type="address" urlParams="chain=evm">
              <div class="bu-is-size-7">Contract</div>
            </Hash>
            <Hash hash={currentMarket.base.address} type="address" urlParams="chain=evm">
              <div class="bu-is-size-7">Market</div>
            </Hash>
          </div>
        </div>
      </div>
      <div className="bu-columns">
        <div class="bu-column bu-is-4" style={{ height: '100%' }}>
          <DashboardCard title="Price">
            <div class="bu-is-size-4">
              {isLoadingTrades ? (
                'Loading price...'
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      color: isPriceFall ? '#de4b4b' : '#51c758',
                    }}
                  >
                    {isPriceFall ? '↓' : '↑'}
                    {Number(trades[0].qp).toFixed(8)} {currentMarket.quote.symbol}
                  </div>
                  <div class="bu-is-size-6">
                    (24hr: {priceChange24hrPercent.toFixed(4) + '%'}){' '}
                    {Math.abs(priceChange24hrValue).toFixed(6)} {currentMarket.quote.symbol}
                  </div>
                </div>
              )}{' '}
            </div>
          </DashboardCard>
          <DashboardCard>
            <div className="bu-button" style={{ display: 'flex', alignItems: 'center' }}>
              <div class="bu-mr-2">
                <Render id="velas-dextools" name="wagyu-logo" />
              </div>
              BUY/SELL
            </div>
          </DashboardCard>
          <DashboardCard size="small">
            <TokenData market={currentMarket} />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-8">
          <TradingView token={tokenPair} datafeed={datafeed} />
        </div>
      </div>
      <LastTrades market={currentMarket} />
    </div>
  );
});
