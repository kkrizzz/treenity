await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const { numberWithSpaces } = await require('solarea://explorer/utils');

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
  const { data, isLoading } = solarea.useQuery(['market_trades', token], () =>
    fetch(`/velas/market/${token}/trades`).then((res) => res.json()),
  );
  if (isLoading) return 'Loading trades ...';
  return (
    <div>
      <Render id="explorer" name="theme-css" />
      <Table
        columns={columns}
        data={data}
        rowStyle={({ side }) => ({
          background: side === 'BUY' ? 'rgba(83,227,73,0.56)' : 'rgba(243,81,81,0.49)',
        })}
      />
    </div>
  );
});
