const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');

const LPS = 0.000000001;

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

const ProgressBar = () => {
  return (
    <progress className="bu-progress bu-is-small bu-is-success" max="100">
      100%
    </progress>
  );
};

const SmallCard = ({ head, children, foot }) => {
  return (
    <div>
      <div className="bu-is-size-5 bu-has-text-black">{head}</div>
      <div>
        <div className="bu-is-size-3 bu-has-text-primary">{children}</div>
      </div>
      <div className="bu-is-size-5 bu-has-text-primary">{foot}</div>
    </div>
  );
};

const StakeStats = ({ voteAccounts, currentSupply }) => {
  const { current, delinquent } = voteAccounts;
  const { total: totalSupply } = currentSupply.value;

  const sumStake = (acc, val) => acc + val.activatedStake;

  const activeStake = current.reduce(sumStake, 0);
  const delinquentStake = delinquent.reduce(sumStake, 0);

  return (
    <SmallCard
      head="Active Stake"
      foot={
        <div>
          <span className="bu-is-size-5 bu-has-text-black">Delinquent stake: </span>
          {(100 - (activeStake / (activeStake + delinquentStake)) * 100).toFixed(2)}%
        </div>
      }
    >
      <div class="bu-is-size-3 bu-has-text-primary">
        {humanizeFormatter(activeStake * LPS, 1)}
        <span className="bu-is-size-3 bu-has-text-black">/</span>
        <span className="bu-is-size-3 bu-has-text-black">
          {humanizeFormatter(totalSupply * LPS, 1)}
        </span>
      </div>
    </SmallCard>
  );
};

const PriceStats = ({ coinData }) => {
  const marketData = coinData.market_data;
  const priceChangePercentage24h = marketData.price_change_percentage_24h;
  const priceChangePositive = priceChangePercentage24h >= 0;

  const className = `bu-is-size-5 ${
    priceChangePositive ? 'bu-has-text-success' : 'bu-has-text-danger'
  }`;

  return (
    <SmallCard
      head="Price"
      foot={
        <div>
          <span className="bu-is-size-5 bu-has-text-black">24h Vol $</span>
          {humanizeFormatter(marketData.total_volume.usd, 1)}
        </div>
      }
    >
      <div className="bu-is-size-3 bu-has-text-primary">
        ${marketData.current_price.usd}
        <span className={className}>{priceChangePositive ? '↑' : '↓'}</span>
        <span className={className}>{priceChangePercentage24h.toFixed(2)}%</span>
      </div>
    </SmallCard>
  );
};

const SupplyStats = ({ currentSupply }) => {
  const { circulating, total: totalSupply } = currentSupply.value;

  return (
    <SmallCard
      head="Circulating Supply"
      foot={
        <div>
          {((circulating / totalSupply) * 100).toFixed(1)}%{' '}
          <span className="bu-is-size-5 bu-has-text-black">is circulating</span>
        </div>
      }
    >
      {humanizeFormatter(circulating * LPS, 1)}
      <span className="bu-is-size-3 bu-has-text-black">/</span>
      <span className="bu-is-size-3 bu-has-text-black">
        {humanizeFormatter(totalSupply * LPS, 1)}
      </span>
    </SmallCard>
  );
};

add(() => {
  const [currentSupply, isSupplyLoading] = solarea.useSolanaRpc('getSupply', 'finalized');
  const [epochInfo, isEpochInfoLoading] = solarea.useSolanaRpc('getEpochInfo');
  const [recentPerformance, isRecentPerformanceLoading] = solarea.useSolanaRpc(
    'getRecentPerformanceSamples',
  );
  const [voteAccounts, isVoteAccountsLoading] = solarea.useSolanaRpc(
    'getVoteAccounts',
    'finalized',
  );

  const { data: coinData, isLoading: isSolanaDataLoading } = solarea.useQuery(
    'solana_coin_data',
    () => fetch('https://api.coingecko.com/api/v3/coins/solana').then((res) => res.json()),
  );

  const cards = [SupplyStats, StakeStats, PriceStats];

  const isLoading = isSupplyLoading || isVoteAccountsLoading || isSolanaDataLoading;
  return (
    <Render id="explorer" name="layout">
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard>
          <div className="bu-columns">
            {isLoading ? (
              <div class="bu-column bu-box">
                <ProgressBar />
              </div>
            ) : (
              cards.map((Card) => (
                <div className="bu-column">
                  <div class="bu-box">
                    <Card
                      coinData={coinData}
                      currentSupply={currentSupply}
                      voteAccounts={voteAccounts}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </BulmaCard>
        <BulmaCard header="Cluster stats">
          {isEpochInfoLoading ? (
            <ProgressBar />
          ) : (
            <div>
              <TwoColumn
                first="Slot"
                link={`/block/${epochInfo.absoluteSlot}`}
                second={epochInfo.absoluteSlot}
              />
              <TwoColumn first="Block height" second={epochInfo.blockHeight} />
              <TwoColumn first="Epoch" second={epochInfo.epoch} />
              <TwoColumn
                first="Epoch progress"
                second={((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100).toFixed(1) + '%'}
              />
            </div>
          )}
        </BulmaCard>
        <BulmaCard header="Transaction stats">
          {isEpochInfoLoading || isRecentPerformanceLoading ? (
            <ProgressBar />
          ) : (
            <div>
              <TwoColumn first="Total transactions" second={epochInfo.transactionCount} />
              <TwoColumn
                first="TPS"
                second={Math.floor(
                  recentPerformance[0].numTransactions / recentPerformance[0].samplePeriodSecs,
                )}
              />{' '}
              <TwoColumn
                first="Average TPS (30 min)"
                second={Math.floor(
                  recentPerformance
                    .slice(0, 60)
                    .reduce((acc, val) => acc + val.numTransactions, 0) / 3600,
                )}
              />
            </div>
          )}
        </BulmaCard>
      </div>
    </Render>
  );
});
