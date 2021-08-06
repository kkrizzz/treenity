const { lpsRound } = await require('solarea://explorer/utils');

const AccountName = render('', 'name', 'react-text');
const BulmaCard = render('dev', 'bulma-card', 'react');
const TwoColumn = render('dev', 'two-column');
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
  const [balance, isLoading] = solarea.useWeb3Rpc('eth_getBalance', entityId, 'latest');

  const [transactionCount, isTransactionCountLoading] = solarea.useWeb3Rpc(
    'eth_getTransactionCount',
    entityId,
    'latest',
  );

  if (isLoading || isTransactionCountLoading) return InfoCard('Account loading . . .');

  return (
    <div className="bu-container bu-is-max-desktop">
      <BulmaCard header="Overview">
        <TwoColumn first="Address" second={entityId} />
        <TwoColumn first="Transaction count" second={parseInt(transactionCount.result, 16)} />
        <TwoColumn
          first="Balance"
          second={`${(parseInt(balance.result, 16) * LPS).toFixed(8)} VLX`}
        />
      </BulmaCard>
      <BulmaCard header="Transactions"></BulmaCard>
      <BulmaCard header="Token holdings"></BulmaCard>
    </div>
  );
};

const SolanaAddressView = ({ entityId }) => {
  const [acc, isLoading] = useAccount(entityId);

  // const [txs, isTxLoading] = useAccountTransactions(entityId);
  const [txs, isTxLoading, txFetchNext] = useLoadSignaturesInfinite(entityId, 10);

  if (isLoading) return InfoCard('Account loading . . .');

  return (
    <div class="bu-container bu-is-max-desktop">
      <BulmaCard header={<div class="flex-between">Account</div>} />
      <Render
        id={entityId}
        render={(item) => <BulmaCard header="View">{item}</BulmaCard>}
        fallback={() => null}
      />
      <BulmaCard header="Overview">
        <div class="bu-columns" style={{ overflowY: 'auto' }}>
          <div class="bu-column">
            <TwoColumn first="Label" second={<AccountName id={entityId} />} />
            <TwoColumn first="Address" second={entityId} />
            <TwoColumn first="Data" second={`${acc ? acc.data.length : 0} bytes`} />
            <TwoColumn first="Balance" second={`${lpsRound(acc ? acc.lamports : 0)} SOL`} />
            <TwoColumn first="Owner" second={acc.owner.toString()} />
          </div>
        </div>
      </BulmaCard>
      <BulmaCard header="Transactions">
        <div class="bu-columns">
          <div class="bu-column text-overflow">
            <div class="bu-columns bu-is-mobile">
              <div class="bu-column bu-is-4 text-overflow bu-is-code">Signature</div>
              <div class="bu-column bu-is-6 bu-is-mobile">Instruction</div>
              <div class="bu-column bu-is-mobile">Age</div>
            </div>
            {isTxLoading ? (
              <progress class="bu-progress bu-is-small bu-is-success" max="100">
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
