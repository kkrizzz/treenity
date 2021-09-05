const { lpsRound } = await require('solarea://explorer/utils');

const TimeAgo = render('dev', 'time-ago');
const AccountName = render('', 'name', 'react-text');
const BulmaCard = render('dev', 'bulma-card', 'react');
const TwoColumn = render('dev', 'two-column');
const EthAddressTokens = render('explorer', 'eth-address-tokens');
const TransactionRow = render('explorer', 'transaction', 'react-table');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');

const InfoCard = (t) => (
  <div class="bu-container bu-is-max-desktop">
    <BulmaCard header={t} />
  </div>
);

const useLoadSignaturesInfinite = (entityId, limit = 10) => {
  const connection = solarea.useConnection();
  const { data: txsData, isLoading: isTxLoading, fetchNextPage } = solarea.useInfiniteQuery(
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
      getNextPageParam: (lastPage, pages) => lastPage[lastPage.length - 1]?.signature,
    },
  );
  return [txsData?.pages.flat(), isTxLoading, () => fetchNextPage()];
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
          <div>
            <div className="bu-columns bu-is-mobile">
              <div className="bu-column bu-is-3">Hash</div>
              <div className="bu-column bu-is-3">From</div>
              <div className="bu-column bu-is-3 text-overflow">To</div>
              <div className="bu-column bu-is-3 text-overflow">Time</div>
            </div>
            {accountTokensArr.slice(0, txListLimit).map((tx, key) => {
              const from = solarea.vlxToEth(tx.from);
              const to = solarea.vlxToEth(tx.to);
              return (
                <div className="bu-columns bu-is-mobile" key={key}>
                  <div className="bu-column bu-is-3 text-overflow">
                    <Hash hash={tx.hash} type="tx" />
                  </div>
                  <div className="bu-column bu-is-3 text-overflow">
                    <NamedHash hash={from} type="address" urlParams="chain=evm" />
                  </div>
                  <div className="bu-column bu-is-3 text-overflow">
                    <NamedHash hash={to} type="address" "chain=evm" />
                  </div>
                  <div className="bu-column bu-is-3 text-overflow">
                    <TimeAgo date={new Date(tx.timeStamp * 1000)} />
                  </div>
                </div>
              );
            })}
            <button
              className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
              onClick={() => setTxListLimit(txListLimit + 10)}
            >
              Load more...
            </button>
          </div>
        );
      },
    },
    {
      name: 'Tokens',
      content: () => <EthAddressTokens entityId={entityId} />,
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
      <BulmaCard header="Account overview">
        <AccountName id={entityId} render={item => <TwoColumn first="Label" second={item} />} fallback={() => null}/>
        <TwoColumn first="Address" second={<Hash hash={entityId} type="address" alignRight />} />
        <TwoColumn
          first="Balance"
          second={`${parsedBalance === 0 ? parsedBalance : (parsedBalance * LPS).toFixed(8)} VLX`}
        />
      </BulmaCard>
      <BulmaCard>
        <div style={{ marginTop: -16 }}>
          <Tabs tabs={tabs} />
        </div>
      </BulmaCard>
    </div>
  );
};

const TokenBalances = render('explorer', 'address-tokens');
const Tabs = render('dev', 'tabs');

const SolanaAddressView = ({ entityId }) => {
  const [account, isLoading] = useAccount(entityId);

  // const [txs, isTxLoading] = useAccountTransactions(entityId);
  const [txs, isTxLoading, txFetchNext] = useLoadSignaturesInfinite(entityId, 10);

  if (isLoading) return InfoCard('Account loading . . .');
  if (!account) return InfoCard(`Account ${entityId} not found`);

  const tabs = [
    {
      name: 'Transactions',
      content: () => (
        <div className="bu-columns">
          <div className="bu-column text-overflow">
            <div className="bu-columns bu-is-mobile">
              <div className="bu-column bu-is-4 text-overflow bu-is-code">Signature</div>
              <div className="bu-column bu-is-4 bu-is-mobile">Instruction</div>
              <div className="bu-column bu-is-2 bu-is-mobile">Age</div>
              <div className="bu-column bu-is-mobile">Result</div>
            </div>
            {isTxLoading ? (
              <progress className="bu-progress bu-is-small bu-is-success" max="100">
                100%
              </progress>
            ) : (
              txs && txs.map((tx) => <TransactionRow signature={tx.signature} />)
            )}
            <button
              className="bu-button bu-is-outlined bu-is-fullwidth bu-is-primary m-t-16"
              onClick={txFetchNext}
            >
              Load more...
            </button>
          </div>
        </div>
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
      <BulmaCard header="Account overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <AccountName id={entityId} render={item => <TwoColumn first="Label" second={item} />} fallback={() => null}/>
            <TwoColumn
              first="Address"
              second={<Hash hash={entityId} type="address" alignRight />}
            />
            <TwoColumn first="Data" second={`${account.data.length} bytes`} />
            <TwoColumn first="Balance" second={`◎${lpsRound(account.lamports)}`} />
            <TwoColumn first="Owner" second={<NamedHash hash={account.owner.toString()} type="address" alignRight />} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard>
        <div style={{ marginTop: -16 }}>
          <Tabs tabs={tabs} />
        </div>
      </BulmaCard>
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
