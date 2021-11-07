const TwoColumn = render('dev', 'two-column');
const Table = render('dev', 'table');
const { useTokenInfoFromGraph } = await require('solarea://velas-dextools/utils');
const { numberWithSpaces } = await require('solarea://explorer/utils');

function precisionRoundMod(number, precision) {
  var factor = Math.pow(10, precision);
  var n = precision < 0 ? number : 0.01 / factor + number;
  return Math.round(n * factor) / factor;
}

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
  <div className="bu-columns bu-is-mobile">
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
    market.base.address === '0xaBf26902Fd7B624e0db40D31171eA9ddDf078351'
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
        <Line name={`Pooled ${i.currency.symbol}`}>{numberWithSpaces(i.value.toFixed(4))}</Line>
      ))}
      <Line name="Total trades">{numberWithSpaces(totalTrades)}</Line>
      <Line name={`${market.base.symbol} holders`}>{numberWithSpaces(holders)}</Line>
      <Line name={`${market.base.symbol} supply`}>{numberWithSpaces(totalSupply)}</Line>
    </div>
  );
};

add(MarketData);
