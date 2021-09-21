const { lpsRound } = await require('solarea://explorer/utils');

const TimeAgo = render('dev', 'time-ago');
const AccountName = render('', 'name', 'react-text');
const BulmaCard = render('dev', 'bulma-card', 'react');
const TwoColumn = render('dev', 'two-column');
const EthAddressTokens = render('explorer', 'eth-address-tokens');
const TransactionRow = render('explorer', 'transaction', 'react-table');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardSection = render('dev', 'dashboard-section');
const DashboardCard = render('dev', 'dashboard-card');
const Table = render('dev', 'table');
const ScrollBox = render('dev', 'scroll-box');

const columns = [
  {
    title: 'Hash',
    dataIndex: 'hash',
    render: (hash) => <Hash hash={hash} type="tx" />,
  },
  {
    title: 'From',
    dataIndex: 'from',
    render: (from) => (
      <NamedHash hash={solarea.vlxToEth(from)} type="address" urlParams="chain=evm" />
    ),
  },
  {
    title: 'To',
    dataIndex: 'to',
    render: (to) => <NamedHash hash={solarea.vlxToEth(to)} type="address" urlParams="chain=evm" />,
  },
  {
    title: 'Time',
    dataIndex: 'timeStamp',
    textAlign: 'right',
    render: (timeStamp) => <TimeAgo date={new Date(timeStamp * 1000)} />,
  },
];

const InfoCard = (t) => (
  <div class="bu-container bu-is-max-desktop">
    <BulmaCard header={t} />
  </div>
);

const useLoadSignaturesInfinite = (entityId, limit = 10) => {
  const connection = solarea.useConnection();
  const {
    data: txsData,
    isLoading: isTxLoading,
    fetchNextPage,
    hasNextPage,
  } = solarea.useInfiniteQuery(
    ['accountSignatures', entityId, connection._rpcEndpoint],
    ({ pageParam }) => {
      console.log(pageParam, 'pageParam');
      return connection.getConfirmedSignaturesForAddress2(
        { toBase58: () => entityId },
        {
          limit,
          before: pageParam,
        },
      );
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 10 ? lastPage[lastPage.length - 1]?.signature : undefined,
    },
  );
  return [txsData?.pages.flat(), isTxLoading, () => fetchNextPage(), hasNextPage];
};

const LPS = 0.000000000000000001;

const EthereumAddressView = ({ entityId }) => {
  const [balance, isLoading] = solarea.useSolanaRpc('eth_getBalance', [entityId, 'latest']);

  const connection = solarea.useConnection();
  const isTestnet = connection._rpcEndpoint.includes('testnet');
  const [txListLimit, setTxListLimit] = React.useState(10);

  const { data: accountTransactions, isLoading: isAccountTransactionsLoading } = solarea.useQuery(
    ['eth_acc_txs', entityId, isTestnet],
    () =>
      fetch(
        `https://explorer.${
          isTestnet ? 'testnet.' : ''
        }velas.com/api?module=account&action=txlist&address=${entityId}&page=1&offset=1000`,
      ).then((res) => res.json()),
  );

  if (isLoading) return InfoCard('Account loading . . .');

  const tabs = [
    {
      name: 'Transactions',
      content: () => {
        if (isAccountTransactionsLoading) return <div>Loading ...</div>;
        const accountTokensArr = accountTransactions.result;
        if (!accountTokensArr.length) return <div>Transactions not found</div>;

        return (
          <>
            <ScrollBox>
              <Table
                stripped
                fixed
                columns={columns}
                data={accountTokensArr.slice(0, txListLimit)}
              />
            </ScrollBox>

            {txListLimit < accountTokensArr.length && (
              <button
                className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
                onClick={() => setTxListLimit(txListLimit + 10)}
              >
                Load more...
              </button>
            )}
          </>
        );
      },
    },
    {
      name: 'Tokens',
      content: () => (
        <BulmaCard>
          <EthAddressTokens entityId={entityId} />
        </BulmaCard>
      ),
    },
  ];

  const parsedBalance = parseInt(balance, 16);
  return (
    <div className="bu-container bu-is-max-desktop">
      <Render
        id={entityId}
        render={(item) => <BulmaCard header="View">{item}</BulmaCard>}
        fallback={() => null}
      />
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
            <DashboardCard title="Balance">
              {`${parsedBalance === 0 ? parsedBalance : (parsedBalance * LPS).toFixed(8)} VLX`}
            </DashboardCard>
          </div>
        </div>
      </DashboardSection>

      <Tabs tabs={tabs} />
    </div>
  );
};

const TokenBalances = render('explorer', 'address-tokens');
const Tabs = render('dev', 'tabs');

const SolanaAddressView = ({ entityId }) => {
  const [account, isLoading] = useAccount(entityId);

  const [txs, isTxLoading, txFetchNext, hasNextPage] = useLoadSignaturesInfinite(entityId, 10);

  if (isLoading) return InfoCard('Account loading . . .');
  if (!account) return InfoCard(`Account ${entityId} not found`);

  const tabs = [
    {
      name: 'Transactions',
      content: () => (
        <>
          {isTxLoading ? (
            <progress className="bu-progress bu-is-small bu-is-success" max="100">
              100%
            </progress>
          ) : (
            txs && txs.map((tx) => <TransactionRow signature={tx.signature} />)
          )}

          {hasNextPage && (
            <button
              className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
              onClick={txFetchNext}
            >
              Load more...
            </button>
          )}
        </>
      ),
    },
    {
      name: 'Tokens',
      content: () => <TokenBalances entityId={entityId} />,
    },
  ];

  return (
    <div class="bu-container bu-is-max-desktop">
      <Render
        id={entityId}
        render={(item) => <BulmaCard header="View">{item}</BulmaCard>}
        fallback={() => null}
      />
      <Render
        id={account.owner.toString()}
        name="owner-program"
        account={account}
        entityId={entityId}
        fallback={() => null}
      />

      <DashboardSection title="Account overview">
        <DashboardCard>
          <div className="bu-columns">
            <AccountName
              id={entityId}
              render={(item) => (
                <div className="bu-column">
                  <DashboardCard size="small" subcard title={'Label'}>
                    {item}
                  </DashboardCard>
                </div>
              )}
              fallback={() => null}
            />

            <div className="bu-column">
              <DashboardCard size="small" subcard title={'Address'}>
                <div style={{ width: '99%' }}>
                  <Hash hash={entityId} type="address" />
                </div>
              </DashboardCard>
            </div>
          </div>

          <div className="bu-columns" style={{ marginBottom: -12 }}>
            <div className="bu-column bu-is-4">
              <DashboardCard size="small" subcard title={'Balance'}>
                ◎{lpsRound(account.lamports)}
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard size="small" subcard title={'Data'}>
                {account.data.length} bytes
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard size="small" subcard title={'Owner'}>
                <NamedHash hash={account.owner.toString()} type="address" />
              </DashboardCard>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>
      <Tabs tabs={tabs} />
    </div>
  );
};

const EntityTypes = {
  sol: SolanaAddressView,
  evm: EthereumAddressView,
};

add(({ entityId, entityType }) => {
  entityType = entityId.startsWith('0x') ? 'evm' : 'sol';
  if (!entityId || !entityType) return InfoCard('Address not specified');

  return EntityTypes[entityType]({ entityId, entityType });
});
