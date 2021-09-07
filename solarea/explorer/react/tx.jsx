const { lpsRound, numberWithSpaces } = await require('solarea://explorer/utils');

const { useTransaction, bs58 } = solarea;

const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Instruction = render('', 'instruction', 'react-list');
const InstructionName = render('', 'instruction', 'react-text');
const AccountName = render('', 'name', 'react-text', { fallback: ({ id }) => id });
const SuccessBadge = render('dev', 'success-badge', 'react');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');

const InstructionDefault = render('explorer', 'default-instruction', 'react-list');
const InstructionDefaultText = render('explorer', 'default-instruction', 'react-text');

const TransactionInstructions = ({ tx }) => {
  return (
    <div>
      <BulmaCard header="Instructions" />
      {tx.transaction.message.instructions.map((inst, index) => {
        const inner = tx.meta.innerInstructions.find((i) => i.index === index)?.instructions;
        return (
          <BulmaCard
            header={
              <div style={{ alignItems: 'center', display: 'flex' }}>
                <span className="bu-tag bu-is-primary m-r-4">#{index + 1}</span>{' '}
                <InstructionName
                  id={inst.programId.toString()}
                  instruction={inst}
                  fallback={() => <InstructionDefaultText instruction={inst} />}
                />
              </div>
            }
          >
            <Instruction
              id={inst.programId.toString()}
              instruction={inst}
              transaction={tx}
              fallback={() => <InstructionDefault instruction={inst} transaction={tx} />}
            />
            {inner?.length && (
              <div style={{ marginTop: '2rem' }}>
                <strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Inner instructions
                </strong>
                {inner.map((inst, innerIndex) => (
                  <div class="bu-box theme-inner-instruction">
                    <div style={{ alignItems: 'center', display: 'flex', marginBottom: '1.5rem' }}>
                      <span class="bu-tag bu-is-primary m-r-4">
                        #{index + 1}.{innerIndex + 1}
                      </span>{' '}
                      <strong>
                        <InstructionName
                          id={inst.programId.toString()}
                          instruction={inst}
                          fallback={() => <InstructionDefaultText instruction={inst} />}
                        />
                      </strong>
                    </div>
                    <Instruction
                      id={inst.programId.toString()}
                      instruction={inst}
                      transaction={tx}
                      fallback={() => <InstructionDefault instruction={inst} transaction={tx} />}
                    />
                  </div>
                ))}
              </div>
            )}
          </BulmaCard>
        );
      })}
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
        let publicKey = key.pubkey;
        return (
          <div className="bu-columns bu-is-mobile overflow-auto">
            <div className="bu-column bu-is-6 text-overflow tc-link">
              <NamedHash hash={publicKey} type="address" />
            </div>
            <div className="bu-column bu-is-3 bu-tc-monospace">
              {lpsRound(tx.meta.postBalances[index] - tx.meta.preBalances[index], 6)}
            </div>
            <div className="bu-column bu-is-3 bu-tc-monospace">
              {numberWithSpaces(lpsRound(tx.meta.postBalances[index], 6))}
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
      <div
        class="bu-notification bu-tc-monospace log-messages"
        style={{
          background: 'var(--theme-main-bg-color)',
          color: 'var(--theme-main-color)',
          margin: '-1rem',
        }}
      >
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
  const [tx, isLoading] = useTransaction(props.entityId, true);

  if (isLoading) return InfoCard('Loading transaction');
  if (!tx) return InfoCard('Transaction not found');

  const signature = tx.transaction.signatures[0];
  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header="Transaction" />
      <BulmaCard header="Overview">
        <div class="bu-columns">
          <div class="bu-column overflow-hidden">
            <TwoColumn is={2} first="Signature" second={<Hash hash={signature} />} />
            <TwoColumn
              is={2}
              first="Block"
              second={<Hash hash={tx.slot.toString()} type="block" alignRight />}
            />
            <TwoColumn is={2} first="Result" second={<SuccessBadge success={!tx.meta?.err} />} />
            <TwoColumn
              is={2}
              first="Timestamp"
              second={new Date(tx.blockTime * 1000).toLocaleString()}
            />
            <TwoColumn is={2} first="Fee" second={`◎${lpsRound(tx.meta?.fee || 0, 6)}`} />
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
  const [tx, isLoading] = solarea.useSolanaRpc('eth_getTransactionByHash', [entityId]);

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
            <TwoColumn is={2} first="Hash" second={<Hash hash={hash} alignRight />} />
            <TwoColumn
              is={2}
              first="Block"
              second={
                <Hash hash={parsedBlockNumber} type="block" urlParams="chain=evm" alignRight />
              }
            />
            <TwoColumn
              is={2}
              first="From"
              second={<NamedHash hash={from} type="address" urlParams="chain=evm" alignRight />}
            />
            <TwoColumn
              is={2}
              first="To"
              second={<NamedHash hash={to} type="address" urlParams="chain=evm" alignRight />}
            />
            <TwoColumn
              is={2}
              first="Value"
              second={`◎ ${(parseInt(value, 16) * LPS).toFixed(16)}`}
            />
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
  if (!props.entityId) return InfoCard('Address not specified');
  const entityType = props.entityId.startsWith('0x') ? 'evm' : 'sol';

  return EntityTypes[entityType](props);
});
