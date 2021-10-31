const TwoColumn = render('dev', 'two-column');
const Table = render('dev', 'table');

const queryMarketData = (market) => `
query MyQuery {
  ethereum(network: velas) {
    address(address: {is: "${market.market}"}) {
      balances(currency: {in: ["${market.base.address}", "${market.quote.address}"]}) {
        currency {
          address
          symbol
        }
        value
      }
    }
    totalTrades: dexTrades(
      baseCurrency: {is: "${market.base.address}"},
      quoteCurrency: {is: "${market.quote.address}"}
    ) {
      count
    }
    totalSupply: transfers(
      currency: {is: "${market.base.address}"}
      sender: {is: "0x0000000000000000000000000000000000000000"}
    ) {
      amount
    }
    holders: transfers(
      currency: {is: "${market.base.address}"}
    ) {
      count(uniq: receivers)
    }
  }
}
`;

const nameStyle = { color: '#A1AAB3', fяontWeight: 500 };
const valueStyle = { fontWeight: 700 };
const Line = ({ name, children }) => (
  <div className="bu-columns">
    <div className="bu-column" style={nameStyle}>
      {name}
    </div>
    <div className="bu-column" style={valueStyle}>
      {children}
    </div>
  </div>
);

const MarketData = ({ market }) => {
  const [marketData, isMarketDataLoading] = useBitQuery(queryMarketData(market));

  if (isMarketDataLoading)
    return (
      <div style={{ padding: 20 }}>
        Loading pool data ... <span className="spinner-grow spinner-grow-sm m-r-4" />{' '}
      </div>
    );

  if (!marketData) {
    return <div style={{ padding: 20 }}>Failed to load market data</div>;
  }

  const marketInfo = marketData.data.ethereum;
  const poolBalances = marketInfo.address[0].balances;
  const totalTrades = marketInfo.totalTrades[0].count;
  const holders = marketInfo.holders[0].count;
  const totalSupply =
    market.base.address === '0x485f49e0764c305dc6fc1da2e5b786f65f8c95aa'
      ? '2.2B'
      : marketInfo.totalSupply[0].amount.toFixed(3);

  return (
    <div
      style={{
        padding: 20,
        minHeight: 256,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {poolBalances.map((i) => (
        <Line name={`Pooled ${i.currency.symbol}`}>{i.value}</Line>
      ))}
      <Line name="Total trades">{totalTrades}</Line>
      <Line name={`${market.base.symbol} holders`}>{holders}</Line>
      <Line name={`${market.base.symbol} supply`}>{totalSupply}</Line>
    </div>
  );
};

add(MarketData);
