const { lpsRound } = await require('solarea://explorer/utils');

const TimeAgo = render('dev', 'time-ago');
const AccountName = render('', 'name', 'react-text');
const BulmaCard = render('dev', 'bulma-card', 'react');
const Link = render('dev', 'link', 'react');
const TwoColumn = render('dev', 'two-column');
const EthAddressTokens = render('explorer', 'eth-address-tokens');
const TransactionRow = render('explorer', 'transaction', 'react-table');

const InfoCard = (t) => (
  <div class="bu-container bu-is-max-desktop">
    <BulmaCard header={t} />
  </div>
);

const useLoadSignaturesInfinite = (entityId, limit = 10) => {
  const connection = solarea.useConnection();
  const { data: txsData, isLoading: isTxLoading, fetchNextPage } = solarea.useInfiniteQuery(
    ['accountSignatures', entityId],
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
  const [balance, isLoading] = solarea.useSolanaRpc('eth_getBalance', entityId, 'latest');

  const { data: accountTransactions, isLoading: isAccountTransactionsLoading } = solarea.useQuery(
    ['eth_acc_txs', entityId],
    () =>
      fetch(
        `https://explorer.velas.com/api?module=account&action=txlist&address=${entityId}`,
      ).then((res) => res.json()),
  );

  const [transactionCount, isTransactionCountLoading] = solarea.useSolanaRpc(
    'eth_getTransactionCount',
    entityId,
    'latest',
  );

  if (isLoading || isTransactionCountLoading) return InfoCard('Account loading . . .');

  const tabs = [
    {
      name: 'Transactions',
      content: () => {
        return !isAccountTransactionsLoading ? (
          <div>
            <div className="bu-columns bu-is-mobile">
              <div className="bu-column bu-is-2">Hash</div>
              <div className="bu-column bu-is-3">From</div>
              <div className="bu-column bu-is-3 text-overflow">To</div>
              <div className="bu-column bu-is-1 text-overflow">Val.</div>
              <div className="bu-column bu-is-3 text-overflow">Time</div>
            </div>
            {accountTransactions.result.map((tx) => {
              const from = solarea.vlxToEth(tx.from);
              const to = solarea.vlxToEth(tx.to);
              return (
                <div className="bu-columns bu-is-mobile">
                  <div className="bu-column bu-is-2 text-overflow">
                    <Link to={`/tx/${tx.hash}`}>{tx.hash}</Link>
                  </div>
                  <div className="bu-column bu-is-3 text-overflow">
                    <Link to={`/address/${from}?chain=evm`}>{from}</Link>
                  </div>
                  <div className="bu-column bu-is-3 text-overflow">
                    <Link to={`/address/${to}?chain=evm`}>{to}</Link>
                  </div>
                  <div className="bu-column bu-is-1 text-overflow">{tx.value}</div>
                  <div className="bu-column bu-is-3 text-overflow">
                    <TimeAgo date={new Date(tx.timeStamp * 1000)} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Loading . . .</div>
        );
      },
    },
    {
      name: 'Tokens',
      content: () => <EthAddressTokens entityId={entityId} />,
    },
    { name: 'Token transfers', content: () => {} },
  ];

  return (
    <div className="bu-container bu-is-max-desktop">
      <BulmaCard header="Overview">
        <TwoColumn first="Address" second={entityId} />
        <TwoColumn first="Transaction count" second={parseInt(transactionCount, 16)} />
        <TwoColumn first="Balance" second={`${(parseInt(balance, 16) * LPS).toFixed(8)} VLX`} />
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
  if (!account) return InfoCard('Account not found');

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
      <BulmaCard header={<div class="flex-between">Account</div>} />
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
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Label" second={<AccountName id={entityId} />} />
            <TwoColumn first="Address" second={entityId} />
            <TwoColumn first="Data" second={`${account.data.length} bytes`} />
            <TwoColumn first="Balance" second={`${lpsRound(account.lamports)} ◎`} />
            <TwoColumn first="Owner" second={<AccountName id={account.owner.toString()} />} />
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
