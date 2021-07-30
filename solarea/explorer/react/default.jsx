const BulmaCard = render('dev', 'bulma-card');

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

const StakeStats = ({ voteAccounts, currentSupply }) => {
  const { current, delinquent } = voteAccounts;
  const { total: totalSupply } = currentSupply.value;

  const sumStake = (acc, val) => acc + val.activatedStake;

  const activeStake = current.reduce(sumStake, 0);
  const delinquentStake = delinquent.reduce(sumStake, 0);

  return (
    <div>
      <div class="bu-is-size-5 bu-has-text-black">Active Stake</div>
      <div>
        <div class="bu-is-size-3 bu-has-text-primary">
          {humanizeFormatter(activeStake * LPS, 1)}
          <span className="bu-is-size-3 bu-has-text-black">/</span>
          <span className="bu-is-size-3 bu-has-text-black">
            {humanizeFormatter(totalSupply * LPS, 1)}
          </span>
        </div>
      </div>
      <div className="bu-is-size-5 bu-has-text-primary">
        <span className="bu-is-size-5 bu-has-text-black">Delinquent stake: </span>
        {(100 - (activeStake / (activeStake + delinquentStake)) * 100).toFixed(2)}%
      </div>
    </div>
  );
};

const PriceStats = ({ coinData }) => {
  const marketData = coinData.market_data;
  const priceChangePercentage24h = marketData.price_change_percentage_24h;
  return (
    <div>
      <div className="bu-is-size-5 bu-has-text-black">Price</div>
      <div>
        <div className="bu-is-size-3 bu-has-text-primary">
          ${marketData.current_price.usd}
          <span className="bu-is-size-5 bu-has-text-black">
            {priceChangePercentage24h >= 0 ? '↑' : '↓'}
          </span>
          <span className="bu-is-size-5 bu-has-text-black">
            {priceChangePercentage24h.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="bu-is-size-5 bu-has-text-primary">
        <span className="bu-is-size-5 bu-has-text-black">24h Vol $</span>
        {humanizeFormatter(marketData.total_volume.usd, 1)}
      </div>
    </div>
  );
};

const SupplyStats = ({ currentSupply }) => {
  const { circulating, total: totalSupply } = currentSupply.value;
  return (
    <div>
      <div class="bu-is-size-5 bu-has-text-black">Circulating Supply</div>
      <div>
        <div class="bu-is-size-3 bu-has-text-primary">
          {humanizeFormatter(circulating * LPS, 1)}
          <span className="bu-is-size-3 bu-has-text-black">/</span>
          <span className="bu-is-size-3 bu-has-text-black">
            {humanizeFormatter(totalSupply * LPS, 1)}
          </span>
        </div>
      </div>
      <div class="bu-is-size-5 bu-has-text-primary">
        {((circulating / totalSupply) * 100).toFixed(1)}%{' '}
        <span className="bu-is-size-5 bu-has-text-black">is circulating</span>
      </div>
    </div>
  );
};

add(() => {
  const [currentSupply, isSupplyLoading] = solarea.useSolanaRpc('getSupply', 'finalized');
  const [voteAccounts, isVoteAccountsLoading] = solarea.useSolanaRpc(
    'getVoteAccounts',
    'finalized',
  );

  const { data: coinData, isLoading: isSolanaDataLoading } = solarea.useQuery(
    'solana_coin_data',
    () => fetch('https://api.coingecko.com/api/v3/coins/solana').then((res) => res.json()),
  );

  const isLoading = isSupplyLoading || isVoteAccountsLoading;
  return (
    <Render id="explorer" name="layout">
      <Render id="explorer" name="test" />
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard>
          {isLoading ? (
            <div className="bu-column">
              <div className="bu-box bu-is-primary">
                <ProgressBar />
              </div>
            </div>
          ) : (
            <div className="bu-columns">
              <div className="bu-column">
                <div className="bu-box bu-is-primary">
                  <SupplyStats currentSupply={currentSupply} />
                </div>
              </div>
              <div className="bu-column">
                <div className="bu-box bu-is-primary">
                  <StakeStats currentSupply={currentSupply} voteAccounts={voteAccounts} />
                </div>
              </div>
              <div className="bu-column">
                <div className="bu-box bu-is-primary">
                  <PriceStats coinData={coinData} />
                </div>
              </div>
            </div>
          )}
        </BulmaCard>
      </div>
    </Render>
  );
});
