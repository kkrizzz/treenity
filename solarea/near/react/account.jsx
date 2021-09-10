await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');

const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
} = await require('solarea://near/utils');
const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Tabs = render('dev', 'tabs');
const Hash = render('dev', 'hash');

const { Buffer, borsh } = solarea;

const TransactionRow = ({ tx }) => {
  useCSS(
    'near-acc-tx.css',
    css`
      .bu-columns:not(:last-child) {
        margin-bottom: 0;
      }
    `,
  );
  return (
    <div className="bu-box">
      <TwoColumn first="Signature" second={<Hash alignRight>{tx.transaction_hash}</Hash>} />
      <TwoColumn first="Action" second={tx.action_kind} />
      <TwoColumn
        first="Receiver"
        second={<Hash alignRight hash={tx.receiver_account_id} type="account" />}
      />
      <TwoColumn
        first="Signer"
        second={<Hash hash={tx.signer_account_id} type="account" alignRight />}
      />
      <TwoColumn
        first="Args"
        second={
          <pre style={{ textAlign: 'left' }} className="bu-box">
            {JSON.stringify(tx.args, null, 2)}
          </pre>
        }
      />
    </div>
  );
};

add(({ entityId }) => {
  const [accData, isLoading] = useNearAccount(entityId);
  const [nftData, isNftDataLoading] = useNearNFT(entityId);
  const [txs, isTxsLoading] = useNearAccTransactions(entityId, 99);

  console.log(txs, isTxsLoading);

  if (isLoading) return <div>Loading . . .</div>;

  const txTabs = [
    {
      name: 'Permissions',
      content: () => {
        if (isTxsLoading) return 'Loading ...';

        return txs.rows
          .filter((i) => i.action_kind === 'ADD_KEY' || i.action_kind === 'DELETE_KEY')
          .map((i) => <TransactionRow tx={i} />);
      },
    },
    {
      name: 'Transfers',
      content: () => {
        if (isTxsLoading) return 'Loading ...';

        return txs.rows
          .filter((i) => i.action_kind === 'TRANSFER')
          .map((i) => <TransactionRow tx={i} />);
      },
    },
    {
      name: 'Calls',
      content: () => {
        if (isTxsLoading) return 'Loading ...';

        return txs.rows
          .filter((i) => i.action_kind === 'FUNCTION_CALL' || i.action_kind === 'DEPLOY_CONTRACT')
          .map((i) => <TransactionRow tx={i} />);
      },
    },
  ];
  const tokensTabs = [
    {
      name: 'NEP-141',
      content: () => '',
    },
    {
      name: 'NEP-177',
      content: () => {
        if (nftData && !isNftDataLoading) {
          console.log(nftData);
          return nftData.map((nftCollection) => {
            return (
              <div>
                <div style={{ alignItems: 'center', display: 'flex', marginBottom: '1.5rem' }}>
                  <img width={32} src={nftCollection.metadata.icon} />
                  <strong>{nftCollection.metadata.name}</strong>
                </div>
                <div style={{ display: 'flex', flexFlow: 'wrap' }}>
                  {nftCollection.tokens.map((i) => {
                    return (
                      <div class="bu-box" style={{ width: '48%', height: 400, marginRight: 12 }}>
                        <TwoColumn first="Token" second={i.metadata.title} />
                        <TwoColumn first="Copies" second={i.metadata.copies} />
                        <div style={{ textAlign: 'center', height: '60%' }}>
                          <img
                            style={{ height: '100%' }}
                            src={
                              i.metadata.media.startsWith('bafy')
                                ? `https://ipfs.fleek.co/ipfs/${i.metadata.media}`
                                : i.metadata.media
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        }

        return 'No nft data';
      },
    },
  ];

  return (
    <div className="bu-container bu-is-max-desktop">
      <BulmaCard header="Near Account" />
      <BulmaCard header="Overview">
        <TwoColumn first="Account" second={entityId} />
        <TwoColumn first="Balance" second={nearHumanBalance(accData.amount) + 'Ⓝ'} />
      </BulmaCard>
      <BulmaCard header="Transactions">
        <Tabs tabs={txTabs} />
      </BulmaCard>
      <BulmaCard header="Tokens">
        <Tabs tabs={tokensTabs} />
      </BulmaCard>
    </div>
  );
});
