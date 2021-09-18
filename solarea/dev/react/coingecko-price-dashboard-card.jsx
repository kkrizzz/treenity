const colors = { green: '#00C164', red: '#FF003D', blue: '#0B74FF' };

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

add(PriceStats);
