const { useLatestImportantActions } = await require('solarea://velas-dextools/utils');
const Hash = render('dev', 'hash');
const Link = render('dev', 'link');
const TimeAgo = render('dev', 'time-ago');

const actionsResolverByType = {
  bigSwap: (trade) => {
    const roundedQuoteAmount = Math.round(trade.amount);
    const actionText = `Swapped ${roundedQuoteAmount} ${trade.quote.symbol} for ${(
      (1 / trade.qp) *
      roundedQuoteAmount
    ).toFixed(4)} ${trade.base.symbol}`;
    return (
      <>
        <div className="bu-column bu-is-8" style={{ fontWeight: 700, color: '#464646' }}>
          <Link to={`/${trade.base.address}?quote=${trade.quote.address}`}>{actionText}</Link>
        </div>
        <div className="bu-column bu-is-4">
          <TimeAgo date={trade.time} />
        </div>
      </>
    );
  },
  newPool: ({ base, quote, createdAt }) => {
    const actionText = `New pool ${base.symbol}/${quote.symbol} created`;
    return (
      <>
        <div className="bu-column bu-is-8" style={{ fontWeight: 700, color: '#464646' }}>
          <Link to={`/${base.address}?quote=${quote.address}`}>{actionText}</Link>
        </div>
        <div className="bu-column bu-is-4">
          <TimeAgo date={createdAt} />
        </div>
      </>
    );
  },
};

add(() => {
  const [importantActions, isImportantActionsLoading] = useLatestImportantActions(10);

  return (
    <div
      style={{
        fontSize: '1rem',
        fontWeight: 500,
      }}
    >
      {isImportantActionsLoading ? (
        <div>
          Loading ...
          <span className="spinner-grow spinner-grow-sm m-r-4" />
        </div>
      ) : importantActions && importantActions.length ? (
        importantActions.map((action, index) => (
          <div className="bu-columns bu-is-mobile">
            {actionsResolverByType[action.actionType](action)}
          </div>
        ))
      ) : (
        'No actions in last 5d '
      )}
    </div>
  );
});
