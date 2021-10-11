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
const styleForSmall = { fontSize: 20, color: '#788CBF', marginLeft: 8 };
const PriceStats = ({ coinData }) => {
  const marketData = coinData.market_data;
  const priceChangePercentage24h = marketData.price_change_percentage_24h;
  const priceChangePositive = priceChangePercentage24h >= 0;

  const color = priceChangePositive ? colors.green : colors.red;

  return (
    <DashboardCard title="NEAR price" size="medium">
      <span style={{ color }}>${marketData.current_price.usd}</span>
      <span style={styleForSmall}>
        <span>{priceChangePositive ? '↑' : '↓'}</span>
        <span>{priceChangePercentage24h.toFixed(2)}%</span>
      </span>
    </DashboardCard>
  );
};

const CirculatingSupply = ({ coinData }) => {
  return (
    <DashboardCard title="Circulating supply Ⓝ" size="medium">
      {nearUtils.humanizeFormatter(coinData.market_data.circulating_supply, 2)}
    </DashboardCard>
  );
};

const MarketCap = ({ coinData }) => {
  console.log(coinData.market_data.market_cap.usd);
  return (
    <DashboardCard title="Circulating supply" size="medium">
      ${nearUtils.humanizeFormatter(coinData.market_data.market_cap.usd, 2)}
    </DashboardCard>
  );
};

const Block = ({ block: { block_height, block_timestamp, author_account_id } }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} class="bu-mb-1">
      <div
        style={{
          height: '40px',
          width: '40px',
          background: '#c6c6c6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        class="bu-mr-2"
      >
        BL
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Hash type="new-block" hash={block_height} />
        <div class="bu-is-size-7">
          <TimeAgo date={new Date(block_timestamp / 1000000)} />
        </div>
      </div>
    </div>
  );
};

const Transc = ({ tx: { transaction_hash, block_timestamp } }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} class="bu-mb-1">
      <div
        style={{
          height: '40px',
          width: '40px',
          background: '#c6c6c6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        class="bu-mr-2"
      >
        TX
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 150 }}>
          <Hash type="new-transaction" hash={transaction_hash} />
        </div>
        <div class="bu-is-size-7">
          <TimeAgo date={new Date(block_timestamp / 1000000)} />
        </div>
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
        <div
          style={{
            background: '#cbd3e7',
            paddingTop: '2rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
            marginBottom: '0.75rem',
          }}
        >
          <div class="bu-container bu-is-max-desktop">
            <div class="bu-columns">
              <div class="bu-column">
                <Search />
              </div>
            </div>
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
          </div>
        </div>
        <div className="bu-container bu-is-max-desktop ">
          <div className="bu-columns">
            <div className="bu-column bu-is-6 bu-mr-1">
              <Overview>
                <div className="bu-columns">
                  <div className="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
                    Latest blocks
                  </div>
                </div>
                {!isLatestBlocksLoading && latestBlocks.map((i) => <Block block={i} />)}
                <button className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16">
                  Load more...
                </button>
              </Overview>
            </div>
            <div className="bu-column bu-is-6">
              <Overview>
                <div className="bu-columns">
                  <div className="bu-column custom-header bu-mb-3 bu-has-text-grey-darker bu-has-text-weight-bold">
                    Latest transactions
                  </div>
                </div>
                {!isLatestTransactionsLoading && latestTransactions.map((i) => <Transc tx={i} />)}
                <button className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16">
                  Load more...
                </button>
              </Overview>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Wrapper>
  );
});
