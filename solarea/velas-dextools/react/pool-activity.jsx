await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const Hash = render('dev', 'hash');
const ScrollBox = render('dev', 'scroll-box');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const { useLiquidityPoolsActivity } = await require('solarea://velas-dextools/utils');

const Wrapper = styled.div([
  css`
    td {
      color: inherit !important;
    }
  `,
]);

const tokenToDecimals = (amount, decimals) => {
  return parseInt(amount) / Math.pow(10, decimals);
};

add(({ market }) => {
  const { base, quote } = market;
  const [data, isLoading] = useLiquidityPoolsActivity(base.address, quote.address, 10);

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type) => <span>{type.toUpperCase()}</span>,
    },
    {
      title: `Amount ${base.symbol}`,
      dataIndex: 'amountAMin',
      render: (num) => numberWithSpaces(tokenToDecimals(num, base.decimals).toFixed(6)),
    },
    {
      title: `Amount ${quote.symbol}`,
      dataIndex: 'amountBMin',
      render: (num) => numberWithSpaces(tokenToDecimals(num, quote.decimals).toFixed(6)),
    },
    {
      title: 'Date',
      dataIndex: 'time',
      render: (time) => new Date(time).toLocaleString(),
    },
  ];

  if (isLoading) return 'Loading pool activity ...';
  return (
    <Wrapper>
      <ScrollBox>
        <Table
          rowStyle={(item) => ({
            fontWeight: '700',
            color: item.type === 'add' ? 'rgba(0, 193, 100, 1)' : 'rgba(255, 75, 119, 1)',
          })}
          bordered
          columns={columns}
          data={data}
        />
      </ScrollBox>
    </Wrapper>
  );
});
