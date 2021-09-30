await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');

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
  },
  {
    title: 'Price',
    dataIndex: 'qp',
  },
];

add(({ market }) => {
  const { data, isLoading } = solarea.useQuery(['market_trades', market], () =>
    fetch(`/velas/market/${market}/trades`).then((res) => res.json()),
  );
  if (isLoading) return 'Loading trades ...';
  return (
    <div>
      <Render id="explorer" name="theme-css" />
      <div class="bu-columns">
        <div class="bu-column bu-is-6">
          <Table
            columns={columns}
            data={data.filter((i) => i.side === 'SELL')}
            rowStyle={() => ({
              background: 'rgba(83,227,73,0.56)',
            })}
          />
        </div>
        <div class="bu-column bu-is-6">
          <Table
            columns={columns}
            data={data.filter((i) => i.side === 'BUY')}
            rowStyle={() => ({
              background: 'rgba(243,81,81,0.49)',
            })}
          />
        </div>
      </div>
    </div>
  );
});
