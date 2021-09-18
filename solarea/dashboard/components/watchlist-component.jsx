const TokenPrice = render('dashboard', 'token-price-component', 'components');

add(function Watchlist({ contracts }) {
  return (
    <div className="bu-columns">
      {contracts.map((contract) => (
        <div className="bu-column">
          <TokenPrice contract={contract} />
        </div>
      ))}
    </div>
  );
});
