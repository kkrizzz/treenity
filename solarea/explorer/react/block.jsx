const { useBlock } = solarea;

const TwoColumn = ({ first, second, is = 4, link: lk }) => {
  useCSS(
    'two-column.css',
    `
   .link {
     font-family: monospace;
     color: #0790d4;
     cursor: pointer;
   }
   .link:hover {
     color: #006ba0;
   }
  `,
  );
  const handleClick = () => {
    window.history.pushState({}, {}, `/${lk}`);
  };
  return (
    <div class="bu-columns bu-is-mobile">
      <div
        onClick={lk ? handleClick : () => {}}
        class={`bu-column bu-is-${is} text-overflow ${lk ? 'link' : ''}`}
      >
        {first}
      </div>
      <div class="bu-column bu-is-mobile">{second}</div>
    </div>
  );
};

const LPS = 0.000000001;

const lpsRound = (lamports) => {
  return (lamports * LPS).toFixed(4);
};

add(({ entityId }) => {
  const [block, loading] = useBlock(+entityId);
  const [showAmount, setShowAmount] = React.useState(10);

  if (loading) {
    return (
      <div className="bu-container bu-is-max-desktop">
        <Render id="explorer" name="acc-css" />
        <Render
          id="dev"
          name="bulma-card"
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
      <Render id="explorer" name="acc-css" />
      <Render id="dev" name="bulma-card" header={<div class="flex-between">Block</div>} />
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Slot" second={entityId} />
            <TwoColumn first="Blockhash" second={block.blockhash} />
            <TwoColumn first="Parent slot" second={block.parentSlot} />
            <TwoColumn first="Processed transactions" second={block.transactions.length} />
          </div>
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Block transactions">
        <div>
          <TwoColumn is={10} first="Signature" second={'Result'} />

          {block.transactions.slice(0, showAmount).map((t, i) => (
            <Render
              key={i}
              id="explorer"
              context="react-table"
              name="transaction"
              transaction={t}
            />
          ))}
        </div>
        <button
          class="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
          onClick={() => setShowAmount((am) => am + 10)}
        >
          Load more...
        </button>
      </Render>
      <Render id="dev" name="bulma-card" header="Block rewards">
        <div className="bu-columns bu-is-mobile">
          <div className="bu-column bu-is-5">Address</div>
          <div className="bu-column bu-is-2">Type</div>
          <div className="bu-column bu-is-3">Amount</div>
          <div className="bu-column bu-is-2">New balance</div>
        </div>
      </Render>
    </div>
  );
});
