const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardCard = render('dev', 'dashboard-card');
const { weiToEth, lpsRound } = await require('solarea://explorer/utils');

add(({ tx }) => {
  const gasUsed = parseInt(tx.gas, 16);
  const gasPrice = parseInt(tx.gasPrice, 16);
  const fee = weiToEth(gasUsed * gasPrice, 8);

  return (
    <>
      <div className="bu-columns">
        <div className="bu-column bu-is-12">
          <DashboardCard subcard title={'Hash'}>
            <Hash hash={tx.hash} type="tx" />
          </DashboardCard>
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-6">
          <DashboardCard subcard title="From">
            <NamedHash hash={tx.from} type="address" />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-6">
          <DashboardCard subcard title="To">
            <NamedHash hash={tx.to} type="address" />
          </DashboardCard>
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-12">
          <DashboardCard subcard title="Amount" value={weiToEth(tx.value)} info={`Fee: ${fee}`} />
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-6">
          <DashboardCard subcard title="Gas used" value={gasUsed} />
        </div>
        <div className="bu-column bu-is-6">
          <DashboardCard subcard title="Gas price" value={gasPrice} />
        </div>
      </div>

      {/*  <div className="bu-column bu-is-6">*/}
      {/*    <DashboardCard subcard title="Gas used" value={gasUsed} />*/}
      {/*  </div>*/}
      {/*  <div className="bu-column bu-is-6">*/}
      {/*    <DashboardCard subcard title="Gas price" value={gasPrice} />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
});
