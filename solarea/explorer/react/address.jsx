const DEFAULT_ENTITY = 'EoQH6QBC8Jjww5DGd1W5h7q3ccMh8LVEXHvMkrHkkce7';

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
  if (!props.entityId) props.entityId = DEFAULT_ENTITY;
  const [acc, isLoading] = useAccount(props.entityId);
  const [txs, isTxLoading] = useAccountTransactions(props.entityId);
  const defaultView = Render({ id: props.entityId });
  return (
    <div class="container is-max-desktop">
      <Render id="explorer" name="acc-css" />
      <Render
        id="dev"
        name="bulma-card"
        header={
          <div class="flex-between">
            Solana account
            <img src="https://explorer.solana.com/favicon.ico" />
          </div>
        }
      />
      {defaultView && defaultView.type != '() => "not found"' && (
        <Render id="dev" name="bulma-card" header="View">
          <Render id={props.entityId}></Render>
        </Render>
      )}
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="columns" style={{ overflowY: 'auto' }}>
          {isLoading ? (
            <span class="spinner"></span>
          ) : (
            <div class="column">
              <TwoColumn ft="Address" sc={props.entityId} />
              <TwoColumn ft="Data" sc={`${acc ? acc.data.length : 0} bytes`} />
              <TwoColumn ft="Balance" sc={`${lpsRound(acc ? acc.lamports : 0)} SOL`} />
            </div>
          )}
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Transactions">
        <div class="columns">
          <div class="column text-overflow">
            <TwoColumn is={8} ft="Signature" sc="Age" />
            {isTxLoading ? (
              <span class="spinner"></span>
            ) : (
              txs &&
              txs.map((tx) => {
                return (
                  <TwoColumn
                    lk={tx.signature}
                    is={8}
                    ft={tx.signature}
                    sc={
                      <Render
                        id="dev"
                        name="time-ago"
                        date={new Date(tx.blockTime * 1000)}
                      ></Render>
                    }
                  ></TwoColumn>
                );
              })
            )}
          </div>
        </div>
      </Render>
    </div>
  );
});
