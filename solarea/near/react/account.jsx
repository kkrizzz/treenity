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

add(({ entityId }) => {
  const [accData, isLoading] = useNearAccount(entityId);
  const [nftData, isNftDataLoading] = useNearNFT(entityId);
  const [txs, isTxsLoading] = useNearAccTransactions(entityId);

  console.log(txs, isTxsLoading);

  if (isLoading) return <div>Loading . . .</div>;

  const txTabs = [
    {
      name: 'Permissions',
      content: () => {
        if (isTxsLoading) return 'Loading ...';

        return txs.rows
          .slice(0, 5)
          .map((i) => (
            <TwoColumn first="Signature" second={<Hash alignRight>{i.transaction_hash}</Hash>} />
          ));
      },
    },
    {
      name: 'Transfers',
      content: () => '',
    },
    {
      name: 'Calls',
      content: () => '',
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
                            style={{ width: '100%', height: '100%' }}
                            src={i.metadata.media.replace(',', ';')}
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
