const LastTrades = render('velas-dextools', 'last-trades');
const PoolActivity = render('velas-dextools', 'pool-activity');
const { toast } = await require('solarea://dev/toast');
const Hash = render('velas-dextools', 'hash');
const Link = render('dev', 'link');
const Tabs = render('velas-dextools', 'tabs');
const TokenData = render('velas-dextools', 'token-data');
const CandleChart = render('velas-dextools', 'candle-chart');
const DashboardCard = render('dev', 'dashboard-card');
const RandomImageWithNonce = render('dev', 'random-image-with-nonce');
const TokenPair = render('velas-dextools', 'token-pair');
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

const WaguySwapBuyButton = styled.button`
  background: #5ea7de;
  width: 100%;
  height: 48px;
  color: white;
  border: none;
  transition: filter 200ms ease-in-out;

  &:hover,
  &:focus {
    filter: brightness(110%);
    color: white;
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
  const tokenSymbols = `${base.symbol}/${quote.symbol}`;

  const [trades, isLoadingTrades] = useLatestTokenTrades(quote.address, base.address);

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

  const tabs = [
    {
      name: 'Trades',
      content: () => <LastTrades market={currentMarket} />,
    },
    {
      name: 'Pools activity',
      content: () => <PoolActivity market={currentMarket} />,
    },
  ];

  const priceChange24hrPercent = currentMarket.priceChange24hrPercent;
  const priceChange24hrValue = currentMarket.priceChange24hrValue;
  const isPriceFall = priceChange24hrPercent < 0;
  return (
    <div class="p-b-8">
      <div class="bu-columns">
        <div class="bu-column" style={{ display: 'flex', alignItems: 'center', flexFlow: 'wrap' }}>
          <div
            class="bu-is-size-6"
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexFlow: 'wrap',
            }}
          >
            <div style={{ minWidth: 64, padding: 4, position: 'relative' }}>
              <RandomImageWithNonce width={64} isEth={true} address={base.address} />
              <div
                onClick={() => addTokenToMetamask(base.address, base.symbol, base.decimals)}
                style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
              >
                <Icon type="metamask" />
              </div>
            </div>

            <TokenPair
              className="bu-ml-4"
              base={base.symbol}
              markets={markets}
              currentMarket={currentMarket.market}
              onSwap={() =>
                window.history.pushState({}, '', `/${quote.address}?quote=${base.address}`)
              }
              onMarketChange={(value) => {
                const targetMarket = markets.find((m) => m.market === value);
                setMarket(targetMarket);
                insertUrlParam('quote', targetMarket.quote.address);
              }}
            />
            <div className="bu-ml-4">
              <Hash
                hash={base.address}
                type="custom"
                customLink={`//velas.solarea.io/address/${base.address}`}
              >
                <div
                  style={{
                    color: 'var(--theme-main-color)',
                    fontFamily: 'var(--theme-font)',
                    fontSize: 16,
                  }}
                >
                  Contract
                </div>
              </Hash>
            </div>
            <div className="bu-ml-4">
              <Hash
                hash={currentMarket.market}
                type="custom"
                customLink={`//velas.solarea.io/address/${currentMarket.market}`}
              >
                <div
                  style={{
                    color: 'var(--theme-main-color)',
                    fontFamily: 'var(--theme-font)',
                    fontSize: 16,
                  }}
                >
                  Market
                </div>
              </Hash>
            </div>
          </div>
        </div>
      </div>
      <div className="bu-columns">
        <div class="bu-column bu-is-5">
          <DashboardCard
            title="Price"
            size="large"
            subcard
            style={{
              height: 256,
            }}
          >
            <div
              style={{
                height: 190,
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div className="bu-is-size-4" style={{ marginTop: 4 }}>
                {isLoadingTrades ? (
                  'Loading price...'
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: isPriceFall
                            ? 'var(--theme-success-color)'
                            : 'var(--theme-error-color)',
                          fontSize: 32,
                        }}
                      >
                        {Number(trades[0].qp).toFixed(8)}{' '}
                      </span>
                      <span
                        style={{
                          color: '#A1AAB3',
                        }}
                      >
                        {quote.symbol}
                      </span>
                    </div>
                    <div
                      style={{
                        color: isPriceFall
                          ? 'var(--theme-success-color)'
                          : 'var(--theme-error-color)',
                        fontSize: '0.9rem',
                      }}
                    >
                      (24hr: {priceChange24hrPercent.toFixed(4) + '%'}){' '}
                      {Math.abs(priceChange24hrValue).toFixed(6)} {quote.symbol}
                    </div>
                  </div>
                )}
              </div>

              <a href={`https://wagyuswap.app/swap/${base.address}`} target="_blank">
                <WaguySwapBuyButton className="bu-button">BUY/SELL</WaguySwapBuyButton>
              </a>
            </div>
          </DashboardCard>
          <DashboardCard size="small" subcard style={{ padding: 0 }}>
            <TokenData market={currentMarket} />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-7">
          <DashboardCard subcard>
            <div style={{ margin: 0 }}>
              <CandleChart token={tokenSymbols} base={base.address} quote={quote.address} />
            </div>
          </DashboardCard>
        </div>
      </div>
      <DashboardCard subcard>
        <div style={{ margin: '-12px -16px' }}>
          <Tabs tabs={tabs} />
        </div>
      </DashboardCard>
    </div>
  );
});
