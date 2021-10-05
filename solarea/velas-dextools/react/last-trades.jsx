await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const DashboardCard = render('dev', 'dashboard-card');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const { useLatestTokenTrades } = await require('solarea://velas-dextools/utils');

const columns = [
  {
    title: 'Date',
    dataIndex: 'time',
    render: (time) => <span>{new Date(time).toLocaleString()}</span>,
  },
  {
    title: 'Side',
    dataIndex: 'side',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    render: (num) => numberWithSpaces(num.toFixed(6)),
  },
  {
    title: 'Price',
    dataIndex: 'qp',
    render: (num) => numberWithSpaces(num.toFixed(6)),
  },
];

add(({ market }) => {
  const { base, quote } = market;
  const token = `${base.address}/${quote.address}`;
  const [data, isLoading] = useLatestTokenTrades(token);
  if (isLoading) return 'Loading trades ...';
  return (
    <div style={{ padding: 0, borderRadius: 12 }} className="bu-card m-b-8">
      <Table
        rowStyle={(item) => ({
          background: item.side === 'BUY' ? 'rgba(82,255,99,0.05)' : 'rgba(255,59,97,0.06)',
        })}
        bordered
        columns={columns}
        data={data}
      />
    </div>
  );
});
