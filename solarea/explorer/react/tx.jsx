import { useTransaction } from 'https://unpkg.com/solarea-utils';

const navigate = (tab) => {
  window.history.pushState({}, {}, '/' + tab);
};

const InstructionDefault = ({ tx }) => {};

const TransactionInstruction = ({ tx }) => {
  return tx.transaction.message.instructions.map((inst, index) => (
    <Render
      id={inst.programId}
      name="instruction"
      context="react-list"
      instruction={inst}
      transaction={inst.transaction}
      fallback={<InstructionDefault tx={inst} />}
    />
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
    window.history.pushState({}, '', `${lk}`);
  };
  return (
    <div class="columns is-mobile">
      <div class={`column is-${is} text-overflow`}>{ft}</div>
      <div className={`column`}>
        {lk ? (
          <Render id="dev" name="link" className="link" to={lk}>
            {sc}
          </Render>
        ) : (
          sc
        )}
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

  if (isLoading) {
    return (
      <div className="container is-max-desktop">
        <Render id="explorer" name="acc-css" />
        <Render
          id="dev"
          name="bulma-card"
          header={<div class="flex-between">Loading transaction . . .</div>}
        />
      </div>
    );
  }

  return (
    <div class="container is-max-desktop">
      <Render id="explorer" name="acc-css" />
      <Render id="dev" name="bulma-card" header={<div class="flex-between">Transaction</div>} />
      <Render id="dev" name="bulma-card" header="Overview">
        <div class="columns" style={{ overflowY: 'auto' }}>
          <div class="column">
            <TwoColumn ft="Signature" sc={tx.transaction.signatures[0]} />
            <TwoColumn ft="Block" sc={tx.slot} lk={`/block/${tx.slot}`} />
            <TwoColumn ft="Result" sc={tx.meta.err ? 'Error' : 'Success'} />
            <TwoColumn ft="Timestamp" sc={new Date(tx.blockTime * 1000).toLocaleString()} />
            <TwoColumn ft="Fee" sc={`${lpsRound(tx.meta.fee)} SOL`} />
          </div>
        </div>
      </Render>
      <Render id="dev" name="bulma-card" header="Account Inputs">
        <AccountInputs tx={tx}></AccountInputs>
      </Render>
      <Render id="dev" name="bulma-card" header="Instructions">
        <TransactionInstruction tx={tx}></TransactionInstruction>
      </Render>
    </div>
  );
});
