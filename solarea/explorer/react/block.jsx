const { useBlock } = solarea;

const BulmaCard = render('dev', 'bulma-card', 'react');
const TwoColumn = render('dev', 'two-column');
const TransactionRow = render('explorer', 'transaction', 'react-table');

add(({ entityId }) => {
  const [block, loading] = useBlock(+entityId);
  const [showAmount, setShowAmount] = React.useState(10);

  if (loading) {
    return (
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard
          header={
            <div className="flex-between">
              <div class="m-r-16">Block </div>
              <progress className="bu-progress bu-is-small bu-is-success" max="100">
                100%
              </progress>
            </div>
          }
        />
      </div>
    );
  }

  console.log(block);

  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header={<div class="flex-between">Block</div>} />
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Slot" second={entityId} />
            <TwoColumn first="Blockhash" second={block.blockhash} />
            <TwoColumn first="Parent slot" second={block.parentSlot} />
            <TwoColumn first="Processed transactions" second={block.transactions.length} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard header="Block transactions">
        <div>
          <TwoColumn is={10} first="Signature" second="Result" />

          {block.transactions.slice(0, showAmount).map((t, i) => (
            <TransactionRow key={i} transaction={t} />
          ))}
        </div>
        {showAmount < block.transactions.length && (
          <button
            class="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
            onClick={() => setShowAmount((am) => am + 10)}
          >
            Load more...
          </button>
        )}
      </BulmaCard>
      <BulmaCard header="Block rewards">
        <div className="bu-columns bu-is-mobile">
          <div className="bu-column bu-is-5">Address</div>
          <div className="bu-column bu-is-2">Type</div>
          <div className="bu-column bu-is-3">Amount</div>
          <div className="bu-column bu-is-2">New balance</div>
        </div>
      </BulmaCard>
    </div>
  );
});
