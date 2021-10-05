const { useTokenInfo } = await require('solarea://velas-dextools/utils');
const DashboardSection = render('dev', 'dashboard-section');
const DashboardCard = render('dev', 'dashboard-card');

const TradingViewCandleChart = render('dev', 'tradingview-candles');

const last = (arr) => arr[arr.length - 1];

add(({ entityId }) => {
  const [data, isLoading] = useTokenInfo(entityId);
  if (isLoading) return <div>Loading ...</div>;
  console.log(data);
  const baseCurrency = data.currency.symbol;
  const POOL_OPTIONS = React.useMemo(() => {
    return data.candles.map((i, index) => ({
      label: `${baseCurrency}/${i.market.quote.symbol}`,
      index,
    }));
  }, [data]);

  const [selectedPool, setSelectedPool] = React.useState(POOL_OPTIONS[0]);

  return (
    <div class="bu-columns">
      <div class="bu-column bu-is-4">
        <DashboardSection title="Pool">
          <select style={{ color: 'black' }} value={selectedPool.label}>
            {POOL_OPTIONS.map((i) => (
              <option value={i.label}>{i.label}</option>
            ))}
          </select>
        </DashboardSection>
        <DashboardSection title="Price">
          <DashboardCard title={baseCurrency + '/' + data.candles[0].market.quote.symbol}>
            <span style={{ color: '#29C574' }}>
              {last(data.candles[0].candles).close.toFixed(6)}
            </span>
          </DashboardCard>
          <DashboardCard title="Price changes 24h.">
            <span style={{ color: '#29C574' }}>↑10.01%</span>
          </DashboardCard>
        </DashboardSection>
        <DashboardSection title="Token info">
          <DashboardCard title="Supply">555523234 {baseCurrency}</DashboardCard>
        </DashboardSection>
      </div>
      <div class="bu-column bu-is-8">
        <TradingViewCandleChart candles={data.candles[0].candles} />
      </div>
    </div>
  );
});
