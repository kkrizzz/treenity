const { lpsRound, numberWithSpaces } = await require('solarea://explorer/utils');

const { useBlock } = solarea;

const BulmaCard = render('dev', 'bulma-card', 'react');
const Link = render('dev', 'link');
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
  const transactions = block.transactions;

  const successfulTransactions = transactions.reduce((acc, val) => {
    if (!val.meta.err) acc += 1;
    return acc;
  }, 0);

  const parentSlot = block.parentSlot;
  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header={<div class="flex-between">Block</div>} />
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Slot" second={entityId} />
            <TwoColumn first="Blockhash" second={block.blockhash} />
            <TwoColumn first="Parent slot" link={`/blocks/${parentSlot}`} second={parentSlot} />
            <TwoColumn first="Processed transactions" second={transactions.length} />
            <TwoColumn first="Successful transactions" second={successfulTransactions} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard header="Block transactions">
        <div>
          <TwoColumn is={10} first="Signature" second="Result" />

          {transactions.slice(0, showAmount).map((t, i) => (
            <TransactionRow key={i} transaction={t} />
          ))}
        </div>
        {showAmount < transactions.length && (
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
          <div className="bu-column bu-is-8">Address</div>
          <div className="bu-column bu-is-2">Type</div>
          <div className="bu-column bu-is-2">Amount</div>
        </div>
        {block.rewards.map((reward) => (
          <div className="bu-columns bu-is-mobile">
            <div className="bu-column bu-is-8 text-overflow">
              <Link to={`/address/${reward.pubkey}`}>{reward.pubkey}</Link>
            </div>
            <div className="bu-column bu-is-2">{reward.rewardType}</div>
            <div className="bu-column bu-is-2">{lpsRound(reward.lamports)}</div>
          </div>
        ))}
      </BulmaCard>
    </div>
  );
});
