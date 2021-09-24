const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const Table = render('dev', 'table');
const ScrollBox = render('dev', 'scroll-box');
const DashboardCard = render('dev', 'dashboard-card');
const NamedHash = render('dev', 'named-hash');

const columns = [
  { title: 'Index', dataIndex: 'index', render: (i, item, index) => `Account #${index + 1}` },
  {
    title: 'Address',
    dataIndex: 'pubkey',
    render: (i, pubkey) => <NamedHash hash={pubkey} type="address" alignRight />,
  },
];

add(({ instruction }) => {
  if (instruction.parsed) {
    return <pre>{JSON.stringify(instruction.parsed.info, null, 2)}</pre>;
  }

  return (
    <div>
      <DashboardCard subcard>
        <ScrollBox>
          <Table stripped headless columns={columns} data={instruction.accounts} />
        </ScrollBox>
      </DashboardCard>
      <DashboardCard subcard>
        <div className="bu-columns bu-is-mobile" style={{ justifyContent: 'space-between' }}>
          <div className={`bu-column bu-is-4 text-overflow`}>Data</div>
          <pre
            className="bu-column bu-tc-monospace"
            style={{
              overflowWrap: 'anywhere',
              background: '#232323',
              maxWidth: 440,
            }}
          >
            {instruction.parsed
              ? JSON.stringify(instruction.parsed, null, 2)
              : instruction.data.toString('hex')}
          </pre>
        </div>
      </DashboardCard>
    </div>
  );
});
