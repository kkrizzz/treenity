const LastTrades = render('velas-dextools', 'last-trades');
const PoolActivity = render('velas-dextools', 'pool-activity');
const { toast } = await require('solarea://dev/toast');
const { useTokenInfoFromGraph } = await require('solarea://velas-dextools/utils');
const Hash = render('velas-dextools', 'hash');
const Link = render('dev', 'link');
const Tabs = render('velas-dextools', 'tabs');
const TokenLogo = render('velas-dextools', 'token-logo');
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

const HeaderHash = styled(Hash)`
  @media screen and (max-width: 480px) {
    padding-top: 1rem;
  }
`;

const PriceCard = styled(DashboardCard)`
  height: 256px;
`;

const PriceCardInner = styled.div`
  height: 190px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  position: relative;

  @media screen and (max-width: 480px) {
    margin-left: 1rem;
  }
`;

const PriceMain = styled.span`
  color: ${({ isFall }) => (isFall ? 'var(--theme-error-color)' : 'var(--theme-success-color)')};
  font-size: 32px;
  font-weight: 700;
`;
const PriceMainSymbol = styled.span`
  color: #3c5269;
  font-weight: 700;
`;
const PriceUSD = styled.span`
  font-size: 20px;
  font-weight: 700;
`;
const PriceUSDSymbol = styled(PriceMainSymbol)`
  font-size: 20px;
`;
const PriceChange = styled.span`
  color: ${({ isFall }) => (isFall ? 'var(--theme-error-color)' : 'var(--theme-success-color)')};
  font-size: 0.9rem;
`;

add(({ token }) => {
  const { data: markets, isLoading: isMarketsLoading } = useLoadMarkets(token);
  const { quote: quoteTokenParam } = solarea.useQueryParams();
  const [tokenDataFromGraph, isTokenDataFromGraphLoading] = useTokenInfoFromGraph(token);

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
            <IconContainer>
              <TokenLogo address={base.address} />
              <div
                onClick={() => addTokenToMetamask(base.address, base.symbol, base.decimals)}
                style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
              >
                <Icon type="metamask" />
              </div>
            </IconContainer>

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
            <HeaderHash
              hash={base.address}
              type="custom"
              customLink={`//velas.solarea.io/address/${base.address}`}
              target="_blank"
              className="bu-ml-4"
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
            </HeaderHash>
            <HeaderHash
              hash={currentMarket.market}
              type="custom"
              customLink={`//velas.solarea.io/address/${currentMarket.market}`}
              target="_blank"
              className="bu-ml-4"
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
            </HeaderHash>
          </div>
        </div>
      </div>
      <div className="bu-columns">
        <div class="bu-column bu-is-5">
          <PriceCard title="Price" size="large" subcard>
            <PriceCardInner>
              <div className="bu-is-size-4" style={{ marginTop: 4 }}>
                {isLoadingTrades ? (
                  'Loading price...'
                ) : !trades.length ? (
                  'No trades found'
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div>
                      <PriceMain isFall={isPriceFall}>{Number(trades[0].qp).toFixed(8)} </PriceMain>
                      <PriceMainSymbol>{quote.symbol}</PriceMainSymbol>
                    </div>
                    <PriceChange isFall={isPriceFall}>
                      (24hr: {priceChange24hrPercent.toFixed(2) + '%'}){' '}
                      {Math.abs(priceChange24hrValue).toFixed(6)} {quote.symbol}
                    </PriceChange>
                    {!isTokenDataFromGraphLoading && tokenDataFromGraph && (
                      <div>
                        <PriceUSD isFall={isPriceFall}>
                          {parseFloat(tokenDataFromGraph.derivedUSD).toFixed(4)}{' '}
                        </PriceUSD>
                        <PriceUSDSymbol>USD</PriceUSDSymbol>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to={`https://exchange.wagyuswap.app/swap/${base.address}`} target="_blank">
                <WaguySwapBuyButton className="bu-button" style={{ fontSize: 20, fontWeight: 700 }}>
                  BUY/SELL
                </WaguySwapBuyButton>
              </Link>
            </PriceCardInner>
          </PriceCard>
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
