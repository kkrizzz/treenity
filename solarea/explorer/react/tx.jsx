import { useTransaction } from 'https://unpkg.com/solarea-utils';

globalThis.React = preact;

const navigate = (tab) => {
  window.history.pushState({}, {}, '/' + tab);
};

const TransactionInstruction = ({ tx }) => {
  return tx.transaction.message.instructions.map((tx, index) => (
    <div className="solarea-tx-default_program-viewport">
      <Render
        instruction={tx}
        transaction={tx.transaction}
        id={tx.programId}
        name="explorer"
        context="react-table"
      />
    </div>
  ));
};

const AccountInputs = ({ tx }) => {
  return (
    <div>
      <div className="columns is-mobile">
        <div className="column is-6">Account</div>
        <div className="column is-3">Change</div>
        <div className="column is-3">Post</div>
      </div>
      {tx.transaction.message.accountKeys.map((key, index) => (
        <div className="columns is-mobile">
          <div className="column is-6 text-overflow link" onClick={() => navigate(key.pubkey)}>
            {key.pubkey === SYSTEM_PROGRAM ? 'System program' : key.pubkey}
          </div>
          <div className="column is-3">
            {((tx.meta.postBalances[index] - tx.meta.preBalances[index]) * LPS).toFixed(6)}
          </div>
          <div className="column is-3">{(tx.meta.postBalances[index] * LPS).toFixed(6)}</div>
        </div>
      ))}
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
    window.history.pushState({}, '', `/${lk}`);
  };
  return (
    <div class="columns is-mobile">
      <div class={`column is-${is} text-overflow`}>{ft}</div>
      <div onClick={lk ? handleClick : () => {}} class={`column ${lk ? 'link' : ''}`}>
        {sc}
      </div>
    </div>
  );
};

const LPS = 0.000000001;
const SYSTEM_PROGRAM = '11111111111111111111111111111111';
const lpsRound = (lamports) => {
  return (lamports * LPS).toFixed(6);
};

const DEFAULT_ENTITY =
  '5FCrbS96pKtdEmJENGtiiLNv6XuF3xcdezjH86UnkCabgLUZg2CMVfbM3ANtZ6hCMpkt3YcxHrPd7WBsZhpbrSsC';

add((props) => {
  if (!props.entityId) props.entityId = DEFAULT_ENTITY;
  const [tx, isLoading] = useTransaction(props.entityId);
  return (
    <div class="container is-max-desktop">
      <Render id="explorer" name="acc-css" />
      <Render
        id="dev"
        name="bulma-card"
        header={
          <div class="flex-between">
            Solana transaction
            <img src="https://explorer.solana.com/favicon.ico" />
          </div>
        }
      />
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="columns" style={{ overflowY: 'auto' }}>
          {isLoading ? (
            <span class="spinner"></span>
          ) : (
            <div class="column">
              <TwoColumn ft="Signature" sc={tx.entityId} />
              <TwoColumn ft="Block" sc={tx.slot} lk={tx.slot} />
              <TwoColumn ft="Result" sc={tx.meta.err ? 'Error' : 'Success'} />
              <TwoColumn ft="Timestamp" sc={new Date(tx.blockTime * 1000).toLocaleString()} />
              <TwoColumn ft="Fee" sc={`${lpsRound(tx.meta.fee)} SOL`} />
            </div>
          )}
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Account Inputs">
        {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}
      </Render>
      <Render id="dev" name="bulma-card" header="Instructions">
        {isLoading ? (
          <span class="spinner"></span>
        ) : (
          <TransactionInstruction tx={tx}></TransactionInstruction>
        )}
      </Render>
    </div>
  );
});
