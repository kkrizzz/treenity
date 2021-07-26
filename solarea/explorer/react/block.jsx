import { useBlock, useTransaction, useAccount } from 'https://unpkg.com/solarea-utils';

const Badge = ({ success }) => {
  useCSS(
    'solarea-tx-badge.css',
    `
   .solarea-tx-badge {
     width: fit-content;
     background: red;
     color: white;
   }
   .solarea-tx-badge-success {
     background: green;
     width: fit-content;
     color: white;
   }
  `,
  );

  return (
    <div className={`solarea-tx-badge${success ? '-success' : ''}`}>
      {success ? 'Success' : 'Error'}
    </div>
  );
};

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
    <div class="columns is-mobile">
      <div
        onClick={lk ? handleClick : () => {}}
        class={`column is-${is} text-overflow ${lk ? 'link' : ''}`}
      >
        {first}
      </div>
      <div class="column is-mobile">{second}</div>
    </div>
  );
};

const LPS = 0.000000001;

const lpsRound = (lamports) => {
  return (lamports * LPS).toFixed(4);
};

add(({ entityId }) => {
  const [block, loading] = useBlock(entityId);

  if (loading) {
    return (
      <div className="container is-max-desktop">
        <Render id="explorer" name="acc-css" />
        <Render
          id="dev"
          name="bulma-card"
          header={<div className="flex-between">Block loading...</div>}
        />
      </div>
    );
  }

  console.log(block);

  return (
    <div class="container is-max-desktop">
      <Render id="explorer" name="acc-css" />
      <Render id="dev" name="bulma-card" header={<div class="flex-between">Block</div>} />
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="columns" style={{ overflowY: 'auto' }}>
          <div class="column">
            <TwoColumn first="Slot" second={entityId} />
            <TwoColumn first="Blockhash" second={'GUwaXGqH6aL1HMmh5ufbhJXby9hiyXaG2LZHgwG2JxM5'} />
            <TwoColumn first="Parent slot" second={''} />
            <TwoColumn first="Processed transactions" second={''} />
            <TwoColumn first="Successful transactions" second={''} />
          </div>
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Block transactions">
        <div style={{ overflowY: 'auto' }}>
          <TwoColumn is={10} first="Signature" second={'Result'} />

          {block.transactions.map((t) => (
            <Render id="explorer" name="transaction" context="react-table" transaction={t}></Render>
          ))}
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Block rewards">
        <div className="columns is-mobile">
          <div className="column is-5">Address</div>
          <div className="column is-2">Type</div>
          <div className="column is-3">Amount</div>
          <div className="column is-2">New balance</div>
        </div>
      </Render>
    </div>
  );
});
