const TwoColumn = render('dev', 'two-column');
const BulmaCard = render('dev', 'bulma-card');
const Link = render('dev', 'link');
const Hash = render('dev', 'hash');
const TimeAgo = render('dev', 'time-ago');
const Chart = render('dev', 'chart');
const DashboardCard = render('dev', 'dashboard-card');
const Search = render('near', 'search');
const DashboardSection = render('dev', 'dashboard-section');
const LayoutHeader = render('near', 'layout-header');
const CoinPriceDashboardCard = render('dev', 'coingecko-price-dashboard-card');
const nearUtils = await require('solarea://near/utils');
const colors = { green: '#00C164', red: '#FF003D', blue: '#0B74FF' };
const { ThemeProvider } = solarea;
const Divider = render('near', 'divider');
await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Overview = render('near', 'overview');
const smallTitleClass = 'bu-is-size-6 bu-has-text-grey-light bu-mb-2 bu-has-text-weight-bold';
const Wrapper = render('near', 'wrapper');

const Block = render('near', 'block', 'react-list');
const Transaction = render('near', 'transaction', 'react-list');

const NearInfo = styled.div`
  .near-info__section {
    margin-left: -20px;
    padding-left: 20px;
    border-left: #e7eaf3 1px solid;
  }

  div:first-child > .near-info__section {
    border-left: none;
  }

  .near-info__section-title {
    font-size: small;
    color: grey;
    text-transform: uppercase;
  }

  .near-info__section-content {
    color: black;
  }
  .near-info__section-info {
    font-size: medium;
    margin-left: 8px;
  }
`;

const PriceStats = ({ coinData }) => {
  const marketData = coinData.market_data;
  const priceChangePercentage24h = marketData.price_change_percentage_24h;
  const priceChangePositive = priceChangePercentage24h >= 0;

  const color = priceChangePositive ? colors.green : colors.red;

  return (
    <div className="near-info__section">
      <div className="near-info__section-title">NEAR price</div>
      <div>
        <span className="near-info__section-content">${marketData.current_price.usd}</span>
        <span className="near-info__section-info" style={{ color }}>
          (<span>{priceChangePositive ? '↑' : '↓'}</span>
          <span>{priceChangePercentage24h.toFixed(2)}%</span>)
        </span>
      </div>
    </div>
  );
};

const CirculatingSupply = ({ coinData }) => {
  return (
    <div className="near-info__section">
      <div className="near-info__section-title">Circulating supply Ⓝ</div>
      <div>
        <span className="near-info__section-content">
          {nearUtils.humanizeFormatter(coinData.market_data.circulating_supply, 2)}
        </span>
      </div>
    </div>
  );
};

const MarketCap = ({ coinData }) => {
  console.log(coinData.market_data.market_cap.usd);
  return (
    <div className="near-info__section">
      <div className="near-info__section-title">Circulating supply</div>
      <div>
        <span className="near-info__section-content">
          ${nearUtils.humanizeFormatter(coinData.market_data.market_cap.usd, 2)}
        </span>
      </div>
    </div>
  );
};

add(() => {
  const [nodeStatus, isNodeStatusLoading] = nearUtils.useNearNodeStatus();
  const [networkInfo, isNetworkInfoLoading] = nearUtils.useNearNetworkInfo();
  const [nearCoinData, isNearCoinDataLoading] = nearUtils.useNearCoinData();
  const [latestBlocks, isLatestBlocksLoading] = nearUtils.useNearLatestBlocks(10);
  const [latestTransactions, isLatestTransactionsLoading] = nearUtils.useNearLatestTransactions(10);

  if (isNodeStatusLoading || isNetworkInfoLoading || isNearCoinDataLoading)
    return 'Loading data ...';

  console.log(latestTransactions, latestBlocks);
  return (
    <Wrapper>
      <ThemeProvider
        theme={{
          borderRadius: '12px',
          colors: {
            main: 'black',
            cardBG: 'var(--theme-card-bg-color)',
            subcardBG: 'var(--theme-subcard-bg-color)',
          },
        }}
      >
        <Render id="explorer" name="theme-css" />
        <LayoutHeader />

        <div className="bu-container bu-is-max-widescreen m-t-32">
          <div className="bu-columns">
            <div className="bu-column">
              <Search />
            </div>
          </div>

          <NearInfo className="bu-columns">
            <div className="bu-column">
              <DashboardCard size="medium" color={{ background: 'white' }}>
                <div className="bu-columns">
                  <div className="bu-column bu-is-4">
                    <PriceStats coinData={nearCoinData} />
                  </div>
                  <div className="bu-column bu-is-4">
                    <MarketCap coinData={nearCoinData} />
                  </div>
                  <div className="bu-column bu-is-4">
                    <CirculatingSupply coinData={nearCoinData} />
                  </div>
                </div>
              </DashboardCard>
            </div>
          </NearInfo>

          <div className="bu-columns">
            <div className="bu-column bu-is-6">
              <Overview>
                <div className="bu-columns bu-mb-3">
                  <div className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold">
                    Latest blocks
                  </div>
                  <div className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold">
                    Validator
                  </div>
                </div>
                {!isLatestBlocksLoading && latestBlocks.map((i) => <Block block={i} />)}
                <button className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16">
                  View more
                </button>
              </Overview>
            </div>
            <div className="bu-column bu-is-6">
              <Overview>
                <div className="bu-columns bu-mb-3">
                  <div className="bu-column bu-is-5 custom-header bu-has-text-grey-darker bu-has-text-weight-bold bu-is-two-fifths">
                    Latest transactions
                  </div>

                  <div
                    className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold bu-is-4"
                    style={{ width: '30%' }}
                  >
                    From
                  </div>

                  <div
                    className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold bu-is-4"
                    style={{ width: '30%' }}
                  >
                    To
                  </div>
                </div>
                {!isLatestTransactionsLoading &&
                  latestTransactions.map((i) => <Transaction tx={i} />)}
                <button className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16">
                  View more...
                </button>
              </Overview>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Wrapper>
  );
});
