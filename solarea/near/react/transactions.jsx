const nearUtils = await require('solarea://near/utils');
await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Overview = render('near', 'overview');
const Transaction = render('near', 'transaction', 'react-list');

add(() => {
  const [showCount, setShowCount] = React.useState(10);
  const [latestTransactions, isLatestTransactionsLoading] = nearUtils.useNearLatestTransactions(
    showCount,
  );

  return (
    <div className="bu-columns" style={{ marginTop: 16 }}>
      <div className="bu-column bu-is-12">
        <Overview>
          <div className="bu-columns bu-mb-3">
            <div className="bu-column bu-is-5 custom-header bu-has-text-grey-darker bu-has-text-weight-bold bu-is-two-fifths">
              Latest transactions
            </div>

            <div
              className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold bu-is-4"
              style={{ width: '30%' }}
            >
              From
            </div>

            <div
              className="bu-column custom-header bu-has-text-grey-darker bu-has-text-weight-bold bu-is-4"
              style={{ width: '30%' }}
            >
              To
            </div>
          </div>
          {!isLatestTransactionsLoading && latestTransactions.map((i) => <Transaction tx={i} />)}
          <button
            className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
            onClick={() => setShowCount((count) => count + 10)}
          >
            View more...
          </button>
        </Overview>
      </div>
    </div>
  );
});
