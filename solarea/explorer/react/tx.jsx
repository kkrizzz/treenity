const { lpsRound, numberWithSpaces } = await require('solarea://explorer/utils');

const { useTransaction } = solarea;

const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Instruction = render('', 'instruction', 'react-list');
const InstructionName = render('', 'instruction', 'react-text');
const SuccessBadge = render('dev', 'success-badge', 'react');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardSection = render('dev', 'dashboard-section');
const DashboardCard = render('dev', 'dashboard-card');
const Table = render('dev', 'table');
const ScrollBox = render('dev', 'scroll-box');

const InstructionDefault = render('explorer', 'default-instruction', 'react-list');
const InstructionDefaultText = render('explorer', 'default-instruction', 'react-text');

const TransactionInstructions = ({ tx }) => {
  return (
    <DashboardSection title="Instructions" style={{ marginBottom: 16 }}>
      {tx.transaction.message.instructions.map((inst, index) => {
        const inner = tx.meta.innerInstructions.find((i) => i.index === index)?.instructions;
        return (
          <DashboardCard
            title={
              <div style={{ alignItems: 'center', display: 'flex' }}>
                <span className="bu-tag bu-is-primary  m-r-4">#{index + 1}</span>{' '}
                <InstructionName
                  id={inst.programId.toString()}
                  instruction={inst}
                  fallback={() => <InstructionDefaultText instruction={inst} />}
                />
              </div>
            }
            info={
              <span style={{ fontSize: 14 }}>
                <NamedHash hash={inst.programId.toString()} type="address" />
              </span>
            }
          >
            <div style={{ paddingTop: 16 }}>
              <Instruction
                id={inst.programId.toString()}
                instruction={inst}
                transaction={tx}
                fallback={() => <InstructionDefault instruction={inst} transaction={tx} />}
              />
              {inner?.length && (
                <div style={{ marginBottom: -40, marginTop: 20, padding: 0 }}>
                  <DashboardSection title="Inner instructions">
                    {inner.map((inst, innerIndex) => (
                      <DashboardCard
                        subcard
                        title={
                          <div
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              marginBottom: '1.5rem',
                            }}
                          >
                            <span className="bu-tag bu-is-primary m-r-4">
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
                        }
                      >
                        <Instruction
                          id={inst.programId.toString()}
                          instruction={inst}
                          transaction={tx}
                          fallback={() => (
                            <InstructionDefault instruction={inst} transaction={tx} />
                          )}
                        />
                      </DashboardCard>
                    ))}
                  </DashboardSection>
                </div>
              )}
            </div>
          </DashboardCard>
        );
      })}
    </DashboardSection>
  );
};

const columns = [
  {
    title: 'Account',
    dataIndex: 'publicKey',
    render: (publicKey) => <NamedHash hash={publicKey} type="address" />,
  },
  {
    title: 'Change',
    dataIndex: 'change',
  },
  {
    title: 'Post',
    dataIndex: 'post',
  },
  {
    title: 'Details',
    dataIndex: 'details',
    // textAlign: 'right',
    render: (details) => (
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {details.map((tag) => (
          <div
            className="bu-tag"
            style={{
              border: '1px solid var(--theme-main-content-color)',
              color: 'var(--theme-main-content-color)',
              background: 'transparent',
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    ),
  },
];
const getDetails = (key, message, feePayer) => {
  const tags = [];
  if (key.pubkey === feePayer) tags.push('FeePayer');
  if (key.signer) tags.push('Signer');
  if (key.writable) tags.push('Writable');
  if (message.instructions.find((i) => i.programId === key.pubkey)) tags.push('Program');
  return tags;
};
const AccountInputs = ({ tx }) => {
  console.log(tx);
  let feePayer = null;
  for (let key of tx.transaction.message.accountKeys) {
    if (key.signer) {
      feePayer = key.pubkey;
      break;
    }
  }
  const data = tx.transaction.message.accountKeys.map((key, index) => ({
    publicKey: key.pubkey,
    change: lpsRound(tx.meta.postBalances[index] - tx.meta.preBalances[index], 6),
    post: numberWithSpaces(lpsRound(tx.meta.postBalances[index], 6)),
    details: getDetails(key, tx.transaction.message, feePayer),
  }));
  return (
    <div
      style={{ padding: 0, boxShadow: '0 4px 50px rgba(40, 61, 113, 0.1)' }}
      className="bu-card m-b-8"
    >
      <ScrollBox minWidth={950}>
        <Table columns={columns} data={data} stripped />
      </ScrollBox>
    </div>
  );
};

const TransactionLog = ({ tx }) => {
  return (
    <DashboardSection title={'Log messages'}>
      <div
        className="bu-notification bu-monospace log-messages"
        style={{
          background: 'var(--theme-logs-bg)',
          color: 'var(--theme-logs-color)',
          borderRadius: 'var(--theme-border-radus)',
        }}
      >
        {tx.meta.logMessages.map((text) => (
          <div>{text}</div>
        ))}
      </div>
    </DashboardSection>
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
      <DashboardSection title="Transaction" style={{ marginBottom: 16 }}>
        <DashboardCard
          title="Overview"
          size="large"
          info={<SuccessBadge success={!tx.meta?.err} />}
        >
          <div className="bu-columns" style={{ marginTop: 4 }}>
            <div className="bu-column bu-is-4">
              <DashboardCard size="small" subcard title="Block">
                <Hash hash={tx.slot.toString()} type="block" />
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard size="small" subcard title="Fee">
                ◎${lpsRound(tx.meta?.fee || 0, 6)}
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard size="small" subcard title="Timestamp">
                {new Date(tx.blockTime * 1000).toLocaleString()}
              </DashboardCard>
            </div>
          </div>
          <div className="bu-columns">
            <div className="bu-column bu-is-12">
              <DashboardCard size="small" subcard title="Signature">
                <Hash hash={signature} type="address" />
              </DashboardCard>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>

      <DashboardSection title="Account Inputs" style={{ marginBottom: 16 }}>
        <AccountInputs tx={tx} />
      </DashboardSection>
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

  return (
    <div className="bu-container bu-is-max-desktop">
      <DashboardSection title="EVM Transaction">
        <BulmaCard>
          <Render tx={tx} id="explorer" name="evm-transaction" context="react-list" />
        </BulmaCard>
      </DashboardSection>
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
