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
      : marketInfo.totalSupply[0].amount;

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
        <div className="bu-columns">
          <div
            className="bu-column"
            style={{ color: '#A1AAB3', wontWeight: 500 }}
          >{`Pooled ${i.currency.symbol}`}</div>
          <div className="bu-column">{i.value}</div>
        </div>
      ))}
      <div className="bu-columns">
        <div className="bu-column" style={{ color: '#A1AAB3', wontWeight: 500 }}>
          Total trades
        </div>
        <div className="bu-column">{totalTrades}</div>
      </div>

      <div className="bu-columns">
        <div
          className="bu-column"
          style={{ color: '#A1AAB3', wontWeight: 500 }}
        >{`${market.base.symbol} holders`}</div>
        <div className="bu-column">{holders}</div>
      </div>
      <div className="bu-columns">
        <div
          className="bu-column"
          style={{ color: '#A1AAB3', wontWeight: 500 }}
        >{`${market.base.symbol} supply`}</div>
        <div className="bu-column">{totalSupply}</div>
      </div>
    </div>
  );
};

add(MarketData);
