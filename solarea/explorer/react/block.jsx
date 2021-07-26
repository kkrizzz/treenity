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

const TwoColumn = ({ ft, sc, is, lk }) => {
  if (!is) is = 4;
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
        {ft}
      </div>
      <div class="column is-mobile">{sc}</div>
    </div>
  );
};

const LPS = 0.000000001;

const lpsRound = (lamports) => {
  return (lamports * LPS).toFixed(4);
};

add((props) => {
  return (
    <div class="container is-max-desktop">
      <Render id="explorer" name="acc-css" />
      <Render id="dev" name="bulma-card" header={<div class="flex-between">Block</div>} />
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="columns" style={{ overflowY: 'auto' }}>
          <div class="column">
            <TwoColumn ft="Slot" sc={props.entityId} />
            <TwoColumn ft="Blockhash" sc={'GUwaXGqH6aL1HMmh5ufbhJXby9hiyXaG2LZHgwG2JxM5'} />
            <TwoColumn ft="Parent slot" sc={''} />
            <TwoColumn ft="Processed transactions" sc={''} />
            <TwoColumn ft="Successful transactions" sc={''} />
          </div>
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Block transactions">
        <div style={{ overflowY: 'auto' }}>
          <TwoColumn is={10} ft="Signature" sc={'Result'} />
          <TwoColumn
            is={10}
            lk={'/'}
            ft="3yuGxEhMU9CXzChGH56zawe7f2QEZj7bqxx4UjEtpSD3Bx3Y52pVQtTTtjKWfTmWNEX5yHgnrmjqij1zyLkYbqe8"
            sc={<Badge success={true}></Badge>}
          />
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
