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

add(({ entityId }) => {
  if (!entityId) return InfoCard('Address not specified');
  const [acc, isLoading] = useAccount(entityId);
  const [txs, isTxLoading] = useAccountTransactions(entityId);

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
          </div>
        </div>
      </BulmaCard>
    </div>
  );
});
