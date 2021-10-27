const DashboardCard = render('dev', 'dashboard-card');
const Hash = render('dev', 'hash');
const DashboardSection = render('dev', 'dashboard-section');
const LPS = 0.000000001;

const colors = {
  green: 'var(--theme-success-color)',
  red: 'var(--theme-error-color)',
  blue: 'var(--theme-a-color)',
};
const styleForSmall = { fontSize: 20, color: '#788CBF', marginLeft: 8 };
function humanizeFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

const StakeStats = ({ voteAccounts, currentSupply }) => {
  const { current, delinquent } = voteAccounts;
  const { total: totalSupply } = currentSupply.value;

  const sumStake = (acc, val) => acc + val.activatedStake;

  const activeStake = current.reduce(sumStake, 0);
  const delinquentStake = delinquent.reduce(sumStake, 0);

  return (
    <DashboardCard
      title="Active Stake"
      size="large"
      color={{
        info: colors.green,
        content: colors.blue,
      }}
      info={
        <span>
          {(100 - (activeStake / (activeStake + delinquentStake)) * 100).toFixed(2)}%
          <br />
          delinquent stake
        </span>
      }
    >
      {humanizeFormatter(activeStake * LPS, 1)}
      <span style={styleForSmall}>{humanizeFormatter(totalSupply * LPS, 1)}</span>
    </DashboardCard>
  );
};

const PriceStats = ({ coinData }) => {
  const marketData = coinData.market_data;
  const priceChangePercentage24h = marketData.price_change_percentage_24h;
  const priceChangePositive = priceChangePercentage24h >= 0;

  const color = priceChangePositive ? colors.green : colors.red;

  return (
    <DashboardCard
      title="Price"
      size="large"
      color={color}
      gradient
      info={
        <span>
          24h Vol
          <br />${humanizeFormatter(marketData.total_volume.usd, 1)}
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

const SupplyStats = ({ currentSupply }) => {
  const { circulating, total: totalSupply } = currentSupply.value;

  return (
    <DashboardCard
      title="Circulating Supply"
      size="large"
      color={{
        info: colors.green,
        content: colors.blue,
      }}
      info={
        <span>
          {((circulating / totalSupply) * 100).toFixed(1)}%
          <br />
          is circulating
        </span>
      }
    >
      {humanizeFormatter(circulating * LPS, 1)}
      <span style={styleForSmall}>{humanizeFormatter(totalSupply * LPS, 1)}</span>
    </DashboardCard>
  );
};

const { useSolanaWeb3 } = solarea;

const ClusterStats = ({}) => {
  const [epochInfo, isEpochInfoLoading] = useSolanaWeb3('getEpochInfo', [], {
    refetchInterval: 2000,
  });
  const [recentPerformance, isRecentPerformanceLoading] = useSolanaWeb3(
    'getRecentPerformanceSamples',
  );

  const epochProgress = !isEpochInfoLoading && (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;

  return (
    <>
      {isEpochInfoLoading ? (
        <div className="bu-column bu-box bu-has-text-centered">
          <span className="spinner-grow spinner-grow-sm m-r-4" />
          Loading cluster stats ...
        </div>
      ) : (
        <DashboardSection title="Cluster stats">
          <div className="bu-columns">
            <div className="bu-column bu-is-4">
              <DashboardCard title="Slot" value={epochInfo.absoluteSlot} />
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard
                title="Block height"
                value={<Hash hash={epochInfo.blockHeight} type="block" />}
              />
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard title="Epoch" value={epochInfo.epoch} />
            </div>
          </div>
          <div className="bu-columns">
            <div className="bu-column">
              <DashboardCard title="Epoch progress" value={epochProgress} progress />
            </div>
          </div>
        </DashboardSection>
      )}

      {isEpochInfoLoading || isRecentPerformanceLoading ? (
        <div className="bu-column bu-box bu-has-text-centered">
          <span className="spinner-grow spinner-grow-sm m-r-4" />
          Loading transactions stats ...
        </div>
      ) : (
        <DashboardSection title="Transaction stats">
          <div className="bu-columns">
            <div className="bu-column bu-is-4">
              <DashboardCard title="Total transactions" value={epochInfo.transactionCount} />
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard
                title="TPS"
                value={Math.floor(
                  recentPerformance[0].numTransactions / recentPerformance[0].samplePeriodSecs,
                )}
              />
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard
                title="Average TPS (30 min)"
                value={Math.floor(
                  recentPerformance
                    .slice(0, 60)
                    .reduce((acc, val) => acc + val.numTransactions, 0) / 3600,
                )}
              />
            </div>
          </div>
        </DashboardSection>
      )}
    </>
  );
};

add(() => {
  const [currentSupply, isSupplyLoading] = useSolanaWeb3('getSupply', ['finalized']);
  const [voteAccounts, isVoteAccountsLoading] = useSolanaWeb3('getVoteAccounts', ['finalized']);

  const connection = solarea.useConnection();

  const isSolana = connection._rpcEndpoint.includes('solana');
  const token = isSolana ? 'solana' : 'velas';
  const { data: coinData, isLoading: isSolanaDataLoading } = solarea.useQuery(
    [token, 'coingecko'],
    () => fetch(`https://api.coingecko.com/api/v3/coins/${token}`).then((res) => res.json()),
    { refetchInterval: 5000 },
  );

  const cards = [SupplyStats, StakeStats, PriceStats];

  const isLoading = isSupplyLoading || isVoteAccountsLoading || isSolanaDataLoading;
  return (
    <div className="bu-container bu-is-max-desktop">
      <div className="bu-columns">
        <div className="bu-column bu-is-two-fifths">
          {isLoading ? (
            <div class="bu-column bu-box bu-has-text-centered">
              <span className="spinner-grow spinner-grow-sm m-r-4" />
              Loading token data ...
            </div>
          ) : (
            <div>
              {cards.map((Card) => (
                <div style={{ marginBottom: 28 }}>
                  <Card
                    coinData={coinData}
                    currentSupply={currentSupply}
                    voteAccounts={voteAccounts}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bu-column bu-is-three-fifths">
          <ClusterStats />
        </div>
      </div>
    </div>
  );
});
