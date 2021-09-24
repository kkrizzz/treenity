const NamedHash = render('dev', 'named-hash');
const Table = render('dev', 'table');
const ScrollBox = render('dev', 'scroll-box');
const DashboardCard = render('dev', 'dashboard-card');

const columns = [
  { title: 'Index', dataIndex: 'index', render: (i, item, index) => `Account #${index + 1}` },
  { title: 'Address', dataIndex: 'pubkey', render: (i, pubkey) => pubkey },
];

add(({ id, instruction }) => {
  console.log(instruction);
  return (
    <DashboardCard subcard>
      <ScrollBox>
        <Table stripped headless columns={columns} data={instruction.accounts} />
      </ScrollBox>
    </DashboardCard>
  );
});
