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
    case 'createAccount':
      return (
        <>
          <div className="bu-columns">
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="New account">
                <NamedHash hash={parsed.newAccount} type="address" />
              </DashboardCard>
            </div>

            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Owner">
                <NamedHash hash={parsed.owner} type="address" />
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Space (bytes)">
                {parsed.space}
              </DashboardCard>
            </div>
          </div>
          <div className="bu-columns">
            <div className="bu-column bu-is-6">
              <DashboardCard subcard size="small" title="Source">
                <NamedHash hash={parsed.source} type="address" />
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-6">
              <DashboardCard subcard size="small" title="Lamports">
                {parsed.lamports}
              </DashboardCard>
            </div>
          </div>
        </>
      );
    case 'createAccountWithSeed':
      return (
        <>
          <div className="bu-columns">
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="New account">
                <NamedHash hash={parsed.newAccount} type="address" />
              </DashboardCard>
            </div>

            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Owner">
                <NamedHash hash={parsed.owner} type="address" />
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Space (bytes)">
                {parsed.space}
              </DashboardCard>
            </div>
          </div>
          <div className="bu-columns">
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Source">
                <NamedHash hash={parsed.source} type="address" />
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Lamports">
                {parsed.lamports}
              </DashboardCard>
            </div>
            <div className="bu-column bu-is-4">
              <DashboardCard subcard size="small" title="Seed">
                {parsed.seed}
              </DashboardCard>
            </div>
          </div>
          <div className="bu-columns">
            <div className="bu-column bu-is-12">
              <DashboardCard subcard size="small" title="Base">
                <NamedHash hash={parsed.base} type="address" />
              </DashboardCard>
            </div>
          </div>
        </>
      );
  }
  // TODO
  return <div style={{ width: '100%', wordBreak: 'all' }}>{JSON.stringify(parsed)}</div>;

  // <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});

const i = {
  base: '7wqy51jvVCD3RtY6AgJbMRWn7pPMfTwkHDQTz1fNowKW',
  lamports: 369002282880,
  newAccount: 'EmqVuoVquvpehjBEmSRFjUapqhY8pZmDoHQj9uXYbLVx',
  owner: 'Stake11111111111111111111111111111111111111',
  seed: '0',
  source: '7wqy51jvVCD3RtY6AgJbMRWn7pPMfTwkHDQTz1fNowKW',
  space: 200,
};
