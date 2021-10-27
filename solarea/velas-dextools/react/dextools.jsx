const LastTrades = render('velas-dextools', 'last-trades');
const { toast } = await require('solarea://dev/toast');
const Hash = render('dev', 'hash');
const Link = render('dev', 'link');
const TokenData = render('velas-dextools', 'token-data');
const CandleChart = render('velas-dextools', 'candle-chart');
const DashboardCard = render('dev', 'dashboard-card');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const Icon = render('dashboard', 'icon');

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

async function addTokenToMetamask(address, symbol, decimals) {
  try {
    if (!ethereum) {
      return toast('Metamask not found', 3000, '#f14668');
    }
    if (ethereum.chainId !== '0x6a') {
      return toast(
        'Please change network to Velas: \n\nhttps://support.velas.com/hc/en-150/articles/4405102780818-How-To-Configure-Metamask-for-Velas-Network-RPC',
        10000,
        '#f14668',
      );
    }
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address,
          symbol,
          decimals,
        },
      },
    });

    if (wasAdded) {
      return toast(`Token ${symbol} was successfully added`, 3000, '#56e7a3');
    } else {
      return toast(`Token ${symbol} now added`, 3000, '#f14668');
    }
  } catch (error) {
    toast('Something went wrong', 3000, '#f14668');
  }
}

const WaguySwapBuyButton = styled.div`
  background: ${(props) => props.theme.colors.wagyuswapLinkBg};
  color: ${(props) => props.theme.colors.wagyuswapLinkColor};
  border-color: rgba(156, 169, 180, 0.41);
  &:hover {
    color: ${(props) => props.theme.colors.wagyuswapLinkColor};
  }
`;

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
        color: var(--theme-a-color) !important;
        background: transparent;
        border: none;
      }
      .dextools-custom-select:after {
        border-color: var(--theme-a-color) !important;
      }
      .dextools-custom-select:hover:after {
        border-color: var(--theme-a-hover-color) !important;
      }
      .dextools-custom-select select:hover {
        color: var(--theme-a-hover-color) !important;
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
          <div style={{ minWidth: 64, padding: 4, position: 'relative' }}>
            <RandomImageWithNonce width={64} isEth={true} address={base.address} />
            <div
              onClick={() => addTokenToMetamask(base.address, base.symbol, base.decimals)}
              style={{ position: 'absolute', top: 0, right: 0 }}
            >
              <Icon type="metamask" />
            </div>
          </div>
          <div className="bu-ml-3" style={{ fontSize: '1.5rem' }}>
            {base.symbol} |{' '}
            <Link to={`/${quote.address}?quote=${base.address}`}>{quote.symbol}</Link>
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
            <WaguySwapBuyButton
              className="bu-button"
              style={{
                display: 'flex',
              }}
            >
              <div className="bu-mr-2">
                <Render id="velas-dextools" name="wagyu-logo" />
              </div>
              BUY/SELL
            </WaguySwapBuyButton>
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
