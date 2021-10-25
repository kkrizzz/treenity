const LastTrades = render('velas-dextools', 'last-trades');
const Hash = render('dev', 'hash');
const Link = render('dev', 'link');
const TokenData = render('velas-dextools', 'token-data');
const CandleChart = render('velas-dextools', 'candle-chart');
const DashboardCard = render('dev', 'dashboard-card');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');

const { useLatestTokenTrades } = await require('solarea://velas-dextools/utils');

function insertUrlParam(key, value) {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, value);
  let newurl = '?' + searchParams.toString();
  window.history.replaceState(null, '', newurl);
}

function useLoadMarkets(token) {
  return solarea.useQuery([token, 'markets'], () =>
    fetch(`/api/velas/token/${token}/markets`).then((res) => res.json()),
  );
}

add(({ token }) => {
  const { data: markets, isLoading: isMarketsLoading } = useLoadMarkets(token);
  const { quote: quoteTokenParam } = solarea.useQueryParams();

  if (isMarketsLoading) return <div>Loading markets ...</div>;
  if (!markets.length) return <div>Token markets not found</div>;

  const [currentMarket, setMarket] = React.useState(markets[0]);

  React.useEffect(() => {
    const targetMarket = markets.find((i) => i.quote.address === quoteTokenParam) || markets[0];
    setMarket(targetMarket);
  }, [markets, quoteTokenParam]);

  const { base, quote } = currentMarket;
  const tokenPair = `${base.address}/${quote.address}`;
  const tokenSymbols = `${base.symbol}/${quote.symbol}`;

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
    <div class="p-b-8">
      <div class="bu-columns">
        <div class="bu-column" style={{ display: 'flex', alignItems: 'center', flexFlow: 'wrap' }}>
          <div style={{ minWidth: 64, padding: 4 }}>
            <RandomImageWithNonce width={64} isEth={true} address={base.address} />
          </div>
          <div className="bu-ml-3" style={{ fontSize: '1.5rem' }}>
            {base.symbol} | <Link to={`/${quote.address}`}>{quote.symbol}</Link>
          </div>
          <div
            class="bu-is-size-6 bu-ml-5"
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <div>
              <div className="bu-select dextools-custom-select m-b-4">
                <select
                  value={currentMarket.market}
                  onChange={(e) => {
                    const targetMarket = markets.find((m) => m.market === e.currentTarget.value);
                    setMarket(targetMarket);
                    insertUrlParam('quote', targetMarket.quote.address);
                  }}
                >
                  {markets.map((m) => (
                    <option value={m.market}>
                      {m.base.symbol}/{m.quote.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Hash
              hash={base.address}
              type="custom"
              customLink={`//velas.solarea.io/address/${base.address}`}
            >
              <div class="bu-is-size-7">Contract</div>
            </Hash>
            <Hash
              hash={currentMarket.market}
              type="custom"
              customLink={`//velas.solarea.io/address/${currentMarket.market}`}
            >
              <div class="bu-is-size-7">Market</div>
            </Hash>
          </div>
        </div>
      </div>
      <div className="bu-columns">
        <div class="bu-column bu-is-4" style={{ height: '100%' }}>
          <DashboardCard title="Price" subcard>
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
                    {Number(trades[0].qp).toFixed(8)} {quote.symbol}
                    {isPriceFall ? '↓' : '↑'}
                  </div>
                  <div style={{ color: 'gray', fontSize: '0.9rem' }}>
                    (24hr: {priceChange24hrPercent.toFixed(4) + '%'}){' '}
                    {Math.abs(priceChange24hrValue).toFixed(6)} {quote.symbol}
                  </div>
                </div>
              )}{' '}
            </div>
            <br />
          </DashboardCard>
          <DashboardCard size="small" subcard style={{ padding: 0 }}>
            <TokenData market={currentMarket} />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-8">
          <DashboardCard subcard style={{ padding: 4 }}>
            <CandleChart token={tokenSymbols} base={base.address} quote={quote.address} />
          </DashboardCard>
        </div>
      </div>
      <LastTrades market={currentMarket} />
    </div>
  );
});
