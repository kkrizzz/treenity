const { useTransaction, bs58 } = solarea;

const navigate = (tab) => {
  window.history.pushState({}, {}, '/' + tab);
};

const BulmaCard = render('dev', 'bulma-card');

const InstructionDefault = ({ instruction }) => {
  return <BulmaCard header={'Default: ' + instruction.programId.toBase58()} />;
};

const Instruction = render('', 'instruction', 'react-list');

const TransactionInstructions = ({ tx }) => {
  return tx.transaction.instructions.map((inst, index) => (
    <Instruction
      id={inst.programId.toBase58()}
      instruction={inst}
      transaction={tx}
      fallback={() => <InstructionDefault instruction={inst} />}
    />
  ));
};

const AccountInputs = ({ tx }) => {
  return (
    <div>
      <div className="bu-columns bu-is-mobile">
        <div className="bu-column bu-is-6">Account</div>
        <div className="bu-column bu-is-3">Change</div>
        <div className="bu-column bu-is-3">Post</div>
      </div>
      {tx.transaction.message.accountKeys.map((key, index) => {
        let publicKey = key.toBase58();
        return (
          <div className="bu-columns bu-is-mobile overflow-auto">
            <div className="bu-column bu-is-6 text-overflow link">
              <Render id="dev" name="link" to={`/address/${publicKey}`}>
                <Render
                  id={publicKey}
                  name="name"
                  context="react-text"
                  fallback={() => publicKey}
                />
              </Render>
            </div>
            <div className="bu-column bu-is-3">
              {((tx.meta.postBalances[index] - tx.meta.preBalances[index]) * LPS).toFixed(6)}
            </div>
            <div className="bu-column bu-is-3">
              {(tx.meta.postBalances[index] * LPS).toFixed(6)}
            </div>
          </div>
        );
      })}
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
    <div class="bu-columns bu-is-mobile">
      <div class={`bu-column bu-is-${is} text-overflow`}>{ft}</div>
      <div className="bu-column">
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

add((props) => {
  if (!props.entityId) return <div>Transaction not found</div>;
  const [tx, isLoading] = useTransaction(props.entityId);

  if (isLoading) {
    return (
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard header="Loading transaction" />
      </div>
    );
  }
  if (!tx) {
    return (
      <div className="bu-container bu-is-max-desktop">
        <BulmaCard header="Transaction not found" />
      </div>
    );
  }

  const signature = bs58.encode(tx.transaction.signatures[0].signature);
  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header={<div class="flex-between">Transaction</div>} />
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn ft="Signature" sc={signature} />
            <TwoColumn ft="Block" sc={tx.slot} lk={`/block/${tx.slot}`} />
            <TwoColumn ft="Result" sc={tx.meta.err ? 'Error' : 'Success'} />
            <TwoColumn ft="Timestamp" sc={new Date(tx.blockTime * 1000).toLocaleString()} />
            <TwoColumn ft="Fee" sc={`${lpsRound(tx.meta.fee)} SOL`} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard header="Account Inputs">
        <AccountInputs tx={tx} />
      </BulmaCard>
      <BulmaCard header="Instructions" />
      <TransactionInstructions tx={tx} />
    </div>
  );
});
