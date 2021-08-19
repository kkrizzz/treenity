const { lpsRound } = await require('solarea://explorer/utils');

const { useTransaction, bs58 } = solarea;

const navigate = (tab) => {
  window.history.pushState({}, {}, '/' + tab);
};

const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Instruction = render('', 'instruction', 'react-list');
const InstructionName = render('', 'instruction', 'react-text');
const AccountName = render('', 'name', 'react-text');
const SuccessBadge = render('dev', 'success-badge', 'react');

const InstructionDefault = ({ instruction }) => {
  const programPubkey = instruction.programId.toBase58();
  return (
    <div>
      <TwoColumn
        first="Program"
        second={<AccountName id={programPubkey} fallback={() => programPubkey} />}
        link={`/address/${programPubkey}`}
      />
      {instruction.keys.map((key, index) => {
        const accountPubkey = key.pubkey.toBase58();
        return (
          <TwoColumn
            first={`Account #${index + 1}`}
            second={<AccountName id={accountPubkey} fallback={() => accountPubkey} />}
            link={`/address/${accountPubkey}`}
          />
        );
      })}
      <div className="bu-columns bu-is-mobile" style={{ justifyContent: 'space-between' }}>
        <div className={`bu-column bu-is-4 text-overflow`}>Data</div>
        <div
          className="bu-column tc-monospace"
          style={{
            overflowWrap: 'anywhere',
            background: '#232323',
            maxWidth: 440,
          }}
        >
          {instruction.data.toString('hex')}
        </div>
      </div>
    </div>
  );
};
const InstructionDefaultText = ({ instruction }) => {
  return 'Unknown intruction';
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
              {lpsRound(tx.meta.postBalances[index] - tx.meta.preBalances[index], 6)}
            </div>
            <div className="bu-column bu-is-3 tc-monospace">
              {lpsRound(tx.meta.postBalances[index], 6)}
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

const InfoCard = (t) => (
  <div className="bu-container bu-is-max-desktop">
    <BulmaCard header={t} />
  </div>
);

const SolanaTxView = (props) => {
  if (!props.entityId) return InfoCard('Transaction not specified');
  const [tx, isLoading] = useTransaction(props.entityId);

  if (isLoading) return InfoCard('Loading transaction');
  if (!tx) return InfoCard('Transaction not found');

  const signature = bs58.encode(tx.transaction.signatures[0].signature);
  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header="Transaction" />
      <BulmaCard header="Overview">
        <div class="bu-columns">
          <div class="bu-column overflow-hidden">
            <TwoColumn
              is={2}
              first="Signature"
              second={<div class="text-overflow">{signature}</div>}
            />
            <TwoColumn is={2} first="Block" second={tx.slot} link={`/block/${tx.slot}`} />
            <TwoColumn is={2} first="Result" second={<SuccessBadge success={!tx.meta?.err} />} />
            <TwoColumn
              is={2}
              first="Timestamp"
              second={new Date(tx.blockTime * 1000).toLocaleString()}
            />
            <TwoColumn is={2} first="Fee" second={`${lpsRound(tx.meta?.fee || 0, 6)} SOL`} />
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
};

const LPS = 0.000000000000000001;

const EthereumTxView = ({ entityId }) => {
  const [tx, isLoading] = solarea.useSolanaRpc('eth_getTransactionByHash', entityId);

  if (isLoading) return InfoCard('Loading transaction');
  if (!tx) return InfoCard('Transaction not found');

  const { hash, from, to, blockNumber, nonce, value } = tx;

  const parsedBlockNumber = parseInt(blockNumber, 16);
  const parsedNonce = parseInt(nonce, 16);
  return (
    <div className="bu-container bu-is-max-desktop">
      <BulmaCard header="Transaction" />
      <BulmaCard>
        <div className="bu-columns overflow-hidden">
          <div className="bu-column">
            <TwoColumn is={2} first="Hash" second={<div className="text-overflow">{hash}</div>} />
            <TwoColumn
              is={2}
              first="Block"
              link={`/block/${parsedBlockNumber}?chain=evm`}
              second={parsedBlockNumber}
            />
            <TwoColumn is={2} first="From" link={`/address/${from}`} second={from} />
            <TwoColumn is={2} first="To" link={`/address/${to}`} second={to} />
            <TwoColumn is={2} first="Value" second={(parseInt(value, 16) * LPS).toFixed(16)} />
            <TwoColumn is={2} first="Nonce" second={parsedNonce} />
          </div>
        </div>
      </BulmaCard>
    </div>
  );
};

const EntityTypes = {
  sol: SolanaTxView,
  evm: EthereumTxView,
};

add((props) => {
  const entityType = props.entityId.startsWith('0x') ? 'evm' : 'sol';
  if (!props.entityId) return InfoCard('Address not specified');

  return EntityTypes[entityType](props);
});
