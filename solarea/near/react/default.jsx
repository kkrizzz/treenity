const TwoColumn = render('dev', 'two-column');
const BulmaCard = render('dev', 'bulma-card');
const Chart = render('dev', 'chart');
const DashboardCard = render('dev', 'dashboard-card');
const DashboardSection = render('dev', 'dashboard-section');
const CoinPriceDashboardCard = render('dev', 'coingecko-price-dashboard-card');
const nearUtils = await require('solarea://near/utils');
const colors = { green: '#00C164', red: '#FF003D', blue: '#0B74FF' };

const smallTitleClass = 'bu-is-size-6 bu-has-text-grey-light bu-mb-2 bu-has-text-weight-bold';
const SmallCard = ({ head, items }) => {
  return (
    <div class="bu-box">
      <div className="bu-is-size-4 bu-has-text-black bu-mb-3">{head}</div>
      {items &&
        items.map((item, index) => (
          <div className="bu-mb-2" key={index}>
            <div className={smallTitleClass}>{item.title}</div>
            <div className="bu-is-size-4 bu-has-text-black">{item.value}</div>
          </div>
        ))}
    </div>
  );
};
const styleForSmall = { fontSize: 20, color: '#788CBF', marginLeft: 8 };
const PriceStats = ({ coinData }) => {
  const marketData = coinData.market_data;
  const priceChangePercentage24h = marketData.price_change_percentage_24h;
  const priceChangePositive = priceChangePercentage24h >= 0;

  const color = priceChangePositive ? colors.green : colors.red;

  return (
    <DashboardCard
      title="NEAR price"
      size="large"
      info={
        <span>
          24h Vol
          <br />${nearUtils.humanizeFormatter(marketData.total_volume.usd, 2)}
        </span>
      }
    >
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
    <DashboardCard title="Circulating supply Ⓝ" size="large">
      {nearUtils.humanizeFormatter(coinData.market_data.circulating_supply, 2)}
    </DashboardCard>
  );
};

const MarketCap = ({ coinData }) => {
  console.log(coinData.market_data.market_cap.usd);
  return (
    <DashboardCard title="Circulating supply" size="large">
      ${nearUtils.humanizeFormatter(coinData.market_data.market_cap.usd, 2)}
    </DashboardCard>
  );
};

add(() => {
  const [nodeStatus, isNodeStatusLoading] = nearUtils.useNearNodeStatus();
  const [networkInfo, isNetworkInfoLoading] = nearUtils.useNearNetworkInfo();
  const [nearStats, isNearStatsLoading] = nearUtils.useNearStats();
  const [near2weeksStats, isNear2weeksStatsLoading] = nearUtils.useNearTwoWeeksStats();
  const [nearCoinData, isNearCoinDataLoading] = nearUtils.useNearCoinData();

  if (
    isNodeStatusLoading ||
    isNetworkInfoLoading ||
    isNear2weeksStatsLoading ||
    isNearCoinDataLoading
  )
    return 'Loading data ...';

  const labels = near2weeksStats
    .map((i) => new Date(i.from).toLocaleDateString('en-us', { day: 'numeric', month: 'short' }))
    .reverse();

  return (
    <div>
      <div className="bu-columns">
        <div className="bu-column bu-is-two-fifths">
          <div className="m-b-36">
            <PriceStats coinData={nearCoinData} />
          </div>
          <div className="m-b-36">
            <CirculatingSupply coinData={nearCoinData} />
          </div>
          <div className="m-b-36">
            <MarketCap coinData={nearCoinData} />
          </div>
        </div>
        <div className="bu-column">
          <DashboardSection title="Nodes">
            <div className="bu-columns">
              <div className="bu-column">
                <DashboardCard title="Online" value={90} />
              </div>
              <div className="bu-column">
                <DashboardCard title="Validators" value={nodeStatus.validators.length} />
              </div>
            </div>
            <div className="bu-columns">
              <div className="bu-column">
                <DashboardCard title="Epoch progress" value={123} progress />
              </div>
            </div>
          </DashboardSection>
          <DashboardSection title="Blocks">
            <div className="bu-columns">
              <div className="bu-column">
                <DashboardCard title="Height" value={nodeStatus.sync_info.latest_block_height} />
              </div>
              <div className="bu-column">
                <DashboardCard title="Avg.block time" value={0.99} />
              </div>
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
});
