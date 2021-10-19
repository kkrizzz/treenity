const TwoColumn = render('dev', 'two-column');
const Table = render('dev', 'table');

const queryMarketData = (market) => `
query MyQuery {
  ethereum(network: velas_testnet) {
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

  const marketInfo = marketData.data.ethereum;
  const poolBalances = marketInfo.address[0].balances;
  const totalTrades = marketInfo.totalTrades[0].count; // чет не работает
  const holders = marketInfo.holders[0].count; // чет не работает

  return (
    <Table stripped>
      <tbody>
        {poolBalances.map((i) => (
          <tr>
            <td>{`Pooled ${i.currency.symbol}`}</td>
            <td>{i.value}</td>
          </tr>
        ))}
        <tr>
          <td>Total trades</td>
          <td>{totalTrades}</td>
        </tr>
        <tr>
          <td>{`${market.base.symbol} holders`} </td>
          <td>{holders}</td>
        </tr>
      </tbody>
    </Table>
  );
};

add(MarketData);
