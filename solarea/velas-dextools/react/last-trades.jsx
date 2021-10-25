await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const Hash = render('dev', 'hash');
const ScrollBox = render('dev', 'scroll-box');
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
  {
    title: 'From',
    dataIndex: 'tx',
    render: (tx) => {
      const address = tx.from.address;
      return (
        <div style={{ maxWidth: 200 }}>
          <Hash type="custom" hash={address} customLink={`//velas.solarea.io/address/${address}`} />
        </div>
      );
    },
  },
  {
    title: 'Hash',
    dataIndex: 'tx',
    render: (tx) => (
      <div style={{ maxWidth: 100 }}>
        <Hash type="custom" hash={tx.hash} customLink={`//velas.solarea.io/tx/${tx.hash}`} />
      </div>
    ),
  },
];

add(({ market }) => {
  const { base, quote } = market;
  const token = `${base.address}/${quote.address}`;
  const [data, isLoading] = useLatestTokenTrades(token);
  if (isLoading) return 'Loading trades ...';
  return (
    <ScrollBox>
      <Table
        rowStyle={(item) => ({
          background: item.side === 'BUY' ? 'rgba(82,255,99,0.14)' : 'rgba(255,59,97,0.14)',
        })}
        bordered
        columns={columns}
        data={data}
      />
    </ScrollBox>
  );
});
