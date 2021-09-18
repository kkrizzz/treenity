const TokenChart = render('dev', 'tradingview-candles');

add(({ contracts }) => {
  return (
    <div class="bu-columns" style={{ flexFlow: 'wrap' }}>
      {contracts.map((i) => (
        <div class="bu-column bu-is-6">
          <TokenChart contract={i} />
        </div>
      ))}
    </div>
  );
});
