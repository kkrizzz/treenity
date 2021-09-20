const {
  useAccount: useNearAccount,
  nearHumanBalance,
  useNearNFT,
  useNearAccTransactions,
  useNearTokens,
} = await require('solarea://near/utils');
const BulmaCard = render('dev', 'bulma-card');
const TwoColumn = render('dev', 'two-column');
const Tabs = render('dev', 'tabs');
const AccountTokens = render('near', 'account-tokens');
const Hash = render('dev', 'hash');
const Table = render('dev', 'table');
const NamedHash = render('dev', 'named-hash');
const TransactionRow = render('near', 'transaction', 'react-table');
const ScrollBox = render('dev', 'scroll-box');
const AccountNfts = render('near', 'account-nfts');
const Dropdown = render('dev', 'dropdown');
const Icon = render('near_action', 'icon');

const { Buffer, borsh } = solarea;

add(({ entityId }) => {
  const [accData, isLoading] = useNearAccount(entityId);
  const [nftData, isNftDataLoading] = useNearNFT(entityId);
  const [txs, isTxsLoading] = useNearAccTransactions(entityId, 99);
  const [tokens, isTokensLoading] = useNearTokens(entityId);

  console.log(txs, isTxsLoading);

  if (isLoading || isTxsLoading) return <div>Loading . . .</div>;

  const tokensTabs = [
    {
      name: 'NEP-141',
      content: () => (isTokensLoading ? 'Loading tokens...' : <AccountTokens tokenData={tokens} />),
    },
    {
      name: 'NEP-177',
      content: () => (isNftDataLoading ? 'Loading nft...' : <AccountNfts nftData={nftData} />),
    },
  ];

  useCSS(
    'near-account.css',
    css`
      .inner-shadow {
        box-shadow: inset 0px 0px 5px -2px rgba(0, 0, 0, 0.25);
      }
    `,
  );

  const TX_SORT_DATA = [
    {
      key: 'all',
      name: 'All',
      sort: undefined,
    },
    {
      key: 'fc_call',
      name: <Icon i="FUNCTION_CALL" />,
      sort: ['FUNCTION_CALL', 'DEPLOY_CONTRACT'],
    },
    {
      key: 'transfer',
      name: <Icon i="TRANSFER" />,
      sort: ['TRANSFER'],
    },
    {
      key: 'permissons',
      name: <Icon i="ADD_KEY" />,
      sort: ['ADD_KEY', 'DELETE_KEY'],
    },
  ];

  const [selectedTxFilter, setSelectedTxFilter] = React.useState(TX_SORT_DATA[0]);

  return (
    <div>
      <BulmaCard header="Near Account" />
      <BulmaCard header="Overview">
        <TwoColumn first="Account" second={entityId} />
        <TwoColumn first="Balance" second={nearHumanBalance(accData.amount)} />
      </BulmaCard>
      <BulmaCard header="Tokens">
        <Tabs tabs={tokensTabs} />
      </BulmaCard>
      <BulmaCard
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>Transactions</div>
            <div class="bu-tags">
              {TX_SORT_DATA.map((i) => (
                <div
                  onClick={() => setSelectedTxFilter(i)}
                  class={`bu-tag ${i.key === selectedTxFilter.key ? 'bu-is-primary' : ''}`}
                >
                  {i.name}
                </div>
              ))}
            </div>
          </div>
        }
      >
        <ScrollBox>
          {selectedTxFilter.name === 'All'
            ? txs.rows.map((i) => (
                <div
                  key={`${i.transaction_hash}`}
                  class="bu-box theme-inner-instruction inner-shadow"
                >
                  <TransactionRow tx={i} />
                </div>
              ))
            : txs.rows
                .filter((i) => selectedTxFilter.sort.includes(i.action_kind))
                .map((i) => (
                  <div
                    key={`${i.transaction_hash}`}
                    class="bu-box theme-inner-instruction inner-shadow"
                  >
                    <TransactionRow tx={i} />
                  </div>
                ))}
        </ScrollBox>
      </BulmaCard>
    </div>
  );
});
