const { useTransaction, bs58 } = solarea;

const navigate = (tab) => {
  window.history.pushState({}, {}, '/' + tab);
};

const BulmaCard = render('dev', 'bulma-card');
const Instruction = render('', 'instruction', 'react-list');
const InstructionName = render('', 'instruction', 'react-text');

const InstructionDefault = ({ instruction }) => {
  return <BulmaCard header={'Default: ' + instruction.programId.toBase58()} />;
};
const InstructionDefaultText = ({ instruction }) => {
  return 'Default: ' + instruction.programId.toBase58();
};

const TransactionInstructions = ({ tx }) => {
  return (
    <div>
      <BulmaCard header="Instructions" />
      {tx.transaction.instructions.map((inst, index) => (
        <BulmaCard
          header={
            <InstructionName
              id={inst.programId.toBase58()}
              instruction={inst}
              fallback={() => <InstructionDefaultText instruction={inst} />}
            />
          }
        >
          <Instruction
            id={inst.programId.toBase58()}
            instruction={inst}
            transaction={tx}
            fallback={() => <InstructionDefault instruction={inst} />}
          />
        </BulmaCard>
      ))}
    </div>
  );
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
            <div className="bu-column bu-is-6 text-overflow tc-link">
              <Render id="dev" name="link" to={`/address/${publicKey}`}>
                <Render
                  id={publicKey}
                  name="name"
                  context="react-text"
                  fallback={() => publicKey}
                />
              </Render>
            </div>
            <div className="bu-column bu-is-3 tc-monospace">
              {((tx.meta.postBalances[index] - tx.meta.preBalances[index]) * LPS).toFixed(6)}
            </div>
            <div className="bu-column bu-is-3 tc-monospace">
              {(tx.meta.postBalances[index] * LPS).toFixed(6)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TransactionLog = ({ tx }) => {
  return (
    <BulmaCard header="Log messages">
      <div class="bu-notification tc-monospace" style={{ background: '#232323', margin: '-1rem' }}>
        {tx.meta.logMessages.map((text) => (
          <div>{text}</div>
        ))}
      </div>
    </BulmaCard>
  );
};

const TwoColumn = ({ ft, sc, is = 4, lk }) => {
  useCSS(
    'two-column.css',
    `
   .tc-link {
     font-family: monospace;
     color: #0790d4;
     cursor: pointer;
   }
   .tc-link:hover {
     color: #006ba0;
   }
   .tc-monospace {
     font-family: monospace;
   }
  `,
  );
  return (
    <div class="bu-columns bu-is-mobile">
      <div class={`bu-column bu-is-${is} text-overflow`}>{ft}</div>
      <div className="bu-column tc-monospace">
        {lk ? (
          <Render id="dev" name="link" className="tc-link" to={lk}>
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
const lpsRound = (lamports) => {
  return (lamports * LPS).toFixed(6);
};

add((props) => {
  if (!props.entityId) return <div>Transaction not specified</div>;
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
            <TwoColumn is={2} ft="Signature" sc={signature} />
            <TwoColumn is={2} ft="Block" sc={tx.slot} lk={`/block/${tx.slot}`} />
            <TwoColumn is={2} ft="Result" sc={tx.meta.err ? 'Error' : 'Success'} />
            <TwoColumn is={2} ft="Timestamp" sc={new Date(tx.blockTime * 1000).toLocaleString()} />
            <TwoColumn is={2} ft="Fee" sc={`${lpsRound(tx.meta.fee)} SOL`} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard header="Account Inputs">
        <AccountInputs tx={tx} />
      </BulmaCard>
      <TransactionInstructions tx={tx} />
      <TransactionLog tx={tx} />
    </div>
  );
});
