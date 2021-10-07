const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const Table = render('dev', 'table');
const ScrollBox = render('dev', 'scroll-box');
const DashboardCard = render('dev', 'dashboard-card');
const DashboardSection = render('dev', 'dashboard-section');
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
  useCSS(
    'default-instruction.css',
    css`
      .default-instruction__log {
        overflow-wrap: anywhere;
        background: var(--theme-logs-bg) !important;
        color: var(--theme-logs-color) !important;
        max-width: 440px;
      }
    `,
  );

  return (
    <>
      <DashboardCard subcard style={{ padding: 0 }}>
        <ScrollBox>
          <Table stripped headless columns={columns} data={instruction.accounts} />
        </ScrollBox>
      </DashboardCard>
      <DashboardSection title="Data" style={{ margin: 0 }}>
        <pre
          className="bu-tc-monospace default-instruction__log"
          style={{
            background: 'var(--theme-logs-bg)',
            color: 'var(--theme-logs-color)',
            borderRadius: 'var(--theme-border-radus)',
            maxWidth: 'none',
          }}
        >
          {instruction.parsed
            ? JSON.stringify(instruction.parsed, null, 2)
            : instruction.data.toString('hex')}
        </pre>
      </DashboardSection>
    </>
  );
});
