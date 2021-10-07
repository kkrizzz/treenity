const { lpsRound } = await require('solarea://explorer/utils');
const NamedHash = render('dev', 'named-hash');
const DashboardCard = render('dev', 'dashboard-card');

add(({ id, instruction }) => {
  const parsed = instruction.parsed.info;
  console.log(parsed);
  switch (instruction.parsed.type) {
    case 'transfer':
      return (
        <div className="bu-columns">
          <div className="bu-column bu-is-4">
            <DashboardCard subcard size="small" title="From">
              <NamedHash hash={parsed.source} type="address" />
            </DashboardCard>
          </div>
          <div className="bu-column bu-is-4">
            <DashboardCard subcard size="small" title="Amount" value={lpsRound(parsed.lamports)} />
          </div>
          <div className="bu-column bu-is-4">
            <DashboardCard subcard size="small" title="To">
              <NamedHash hash={parsed.destination} type="address" />
            </DashboardCard>
          </div>
        </div>
      );
    case 'assign':
      return (
        <div className="bu-columns">
          <div className="bu-column bu-is-6">
            <DashboardCard subcard size="small" title="Account">
              <NamedHash hash={parsed.account} type="address" alignRight />
            </DashboardCard>
          </div>
          <div className="bu-column bu-is-6">
            <DashboardCard subcard size="small" title="Owner">
              <NamedHash hash={parsed.owner} type="address" alignRight />
            </DashboardCard>
          </div>
        </div>
      );
    case 'allocate':
      return (
        <div className="bu-columns">
          <div className="bu-column bu-is-6">
            <DashboardCard subcard size="small" title="Account">
              <NamedHash hash={parsed.account} type="address" alignRight />
            </DashboardCard>
          </div>
          <div className="bu-column bu-is-6">
            <DashboardCard subcard size="small" title="Space (bytes)">
              {parsed.space}
            </DashboardCard>
          </div>
        </div>
      );
  }
  // TODO
  return <table class="bu-table"></table>;

  // <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});
