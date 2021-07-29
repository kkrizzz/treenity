const DEFAULT_ENTITY = 'EoQH6QBC8Jjww5DGd1W5h7q3ccMh8LVEXHvMkrHkkce7';

const AccountName = render('', 'name', 'react-text');

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
  return (
    <div class="bu-columns bu-is-mobile">
      <div class={`bu-column bu-is-${is} text-overflow ${lk ? 'link' : ''}`}>
        <Render id="dev" name="link" to={`/tx/${lk}`}>
          {ft}
        </Render>
      </div>
      <div class="bu-column bu-is-mobile">{sc}</div>
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
    <div class="bu-container bu-is-max-desktop">
      <Render id="dev" name="bulma-card" header={<div class="flex-between">Account</div>} />
      {defaultView && defaultView.type != '() => "not found"' && (
        <Render id="dev" name="bulma-card" header="View">
          <Render id={props.entityId}></Render>
        </Render>
      )}
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          {isLoading ? (
            <span class="spinner"></span>
          ) : (
            <div class="bu-column">
              <TwoColumn ft="Label" sc={<AccountName id={props.entityId} />} />
              <TwoColumn ft="Address" sc={props.entityId} />
              <TwoColumn ft="Data" sc={`${acc ? acc.data.length : 0} bytes`} />
              <TwoColumn ft="Balance" sc={`${lpsRound(acc ? acc.lamports : 0)} SOL`} />
            </div>
          )}
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Transactions">
        <div class="bu-columns">
          <div class="bu-column text-overflow">
            <TwoColumn is={8} ft="Signature" sc="Age" />
            {isTxLoading ? (
              <span class="spinner" />
            ) : (
              txs &&
              txs.map((tx) => (
                <TwoColumn
                  lk={tx.signature}
                  is={8}
                  ft={tx.signature}
                  sc={<Render id="dev" name="time-ago" date={new Date(tx.blockTime * 1000)} />}
                />
              ))
            )}
          </div>
        </div>
      </Render>
    </div>
  );
});
