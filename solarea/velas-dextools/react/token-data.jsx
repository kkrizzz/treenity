const TwoColumn = render('dev', 'two-column');

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
  }
}
`;

const MarketData = ({ market }) => {
  const [marketData, isMarketDataLoading] = useBitQuery(queryMarketData(market));

  if (isMarketDataLoading) return 'Loading ...';
  console.log(marketData);

  const marketInfo = marketData.data.ethereum;
  const poolBalances = marketInfo.address[0].balances;
  const totalTrades = marketInfo.totalTrades[0].count; // чет не работает

  return (
    <div>
      {poolBalances.map((i) => (
        <TwoColumn first={`Pooled ${i.currency.symbol}`} second={i.value} />
      ))}
      <TwoColumn first="Total trades" second={totalTrades} />
    </div>
  );
};

add(MarketData);
