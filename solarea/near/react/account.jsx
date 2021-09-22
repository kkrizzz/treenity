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
const DashboardSection = render('dev', 'dashboard-section');
const DashboardCard = render('dev', 'dashboard-card');
const AccountName = render('', 'name', 'react-text');

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
  const [limit, setLimit] = React.useState(10);

  return (
    <div>
      <DashboardSection title="Account overview">
        <AccountName
          id={entityId}
          render={(item) => <DashboardCard title="Label">{item}</DashboardCard>}
          fallback={() => null}
        />
        <div className="bu-columns">
          <div className="bu-column bu-is-8">
            <DashboardCard title="Address">
              <Hash hash={entityId} type="address" />
            </DashboardCard>
          </div>
          <div className="bu-column bu-is-4">
            <DashboardCard title="Balance">{nearHumanBalance(accData.amount)}</DashboardCard>
          </div>
        </div>
      </DashboardSection>
      <DashboardSection title="Tokens">
        <Tabs tabs={tokensTabs} />
      </DashboardSection>
      <DashboardSection
        title={
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
            ? txs.rows.slice(0, limit).map((i) => (
                <DashboardCard
                  key={`${i.transaction_hash}`}
                  class="bu-box theme-inner-instruction inner-shadow"
                >
                  <TransactionRow tx={i} />
                </DashboardCard>
              ))
            : txs.rows
                .slice(0, limit)
                .filter((i) => selectedTxFilter.sort.includes(i.action_kind))
                .map((i) => (
                  <DashboardCard
                    key={`${i.transaction_hash}`}
                    class="bu-box theme-inner-instruction inner-shadow"
                  >
                    <TransactionRow tx={i} />
                  </DashboardCard>
                ))}
        </ScrollBox>
        <button
          className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
          onClick={() => setLimit(limit + 10)}
        >
          Load more...
        </button>
      </DashboardSection>
    </div>
  );
});
