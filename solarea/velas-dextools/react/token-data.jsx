const TwoColumn = render('dev', 'two-column');
const Table = render('dev', 'table');
const { useMarketData, useTokenContractInfo } = await require('solarea://velas-dextools/utils');
const { numberWithSpaces } = await require('solarea://explorer/utils');

const nameStyle = { color: '#A1AAB3', fontWeight: 500 };
const valueStyle = { fontWeight: 700 };
const Line = ({ name, children }) => (
  <div className="bu-columns bu-is-mobile" style={{ lineHeight: '1rem' }}>
    <div className="bu-column" style={nameStyle}>
      {name}
    </div>
    <div className="bu-column" style={valueStyle}>
      {children}
    </div>
  </div>
);

const MarketData = ({ market }) => {
  const [tokenData, isTokenDataLoading] = useTokenContractInfo(market.base.address);

  if (isTokenDataLoading)
    return (
      <div style={{ padding: 20 }}>
        Loading pool data ... <span className="spinner-grow spinner-grow-sm m-r-4" />{' '}
      </div>
    );

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
      {/*{poolBalances.map((i) => (*/}
      {/*  <Line name={`Pooled ${i.currency.symbol}`}>{numberWithSpaces(i.value, 4)}</Line>*/}
      {/*))}*/}
      <Line name="Liquidity USD">${numberWithSpaces(market.amountUSD, 2)}</Line>
      <Line name="Total trades">{numberWithSpaces(market.txs)}</Line>
      <Line name={`Pooled ${market.base.symbol}`}>{numberWithSpaces(market.amountA, 2)}</Line>
      <Line name={`Pooled ${market.quote.symbol}`}>{numberWithSpaces(market.amountB, 2)}</Line>
      <Line name={`${market.base.symbol} holders`}>{numberWithSpaces(tokenData.holders)}</Line>
      <Line name={`${market.base.symbol} supply`}>{numberWithSpaces(tokenData.supply, 2)}</Line>
    </div>
  );
};

add(MarketData);
