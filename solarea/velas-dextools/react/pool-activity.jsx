await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const Hash = render('dev', 'hash');
const ScrollBox = render('dev', 'scroll-box');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const { useLiquidityPoolsActivity } = await require('solarea://velas-dextools/utils');

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5.5" x2="5.5" y2="11" stroke="currentColor" />
    <line x1="11" y1="5.5" y2="5.5" stroke="currentColor" />
  </svg>
);

const MinusIcon = () => (
  <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="0.5" y2="0.5" stroke="currentColor" />
  </svg>
);

const CustomTable = styled.div`
  thead {
    border-bottom: 1px solid var(--theme-main-border-color);
  }

  td {
    color: inherit !important;
  }

  thead > tr > th {
    color: var(--theme-main-content-color);
  }

  tbody {
    background-color: ${(props) => props.theme.colors.subcardBG} !important;
  }

  tbody tr:nth-child(even) {
    background-color: ${(props) => props.theme.colors.subcardBG} !important;
  }

  thead {
    background-color: ${(props) => props.theme.colors.subcardBG} !important;
  }
`;

const tokenToDecimals = (amount, decimals) => {
  return parseInt(amount) / Math.pow(10, decimals);
};

add(({ market }) => {
  const { base, quote } = market;
  const [data, isLoading] = useLiquidityPoolsActivity(base.address, quote.address, 10);

  if (isLoading) return 'Loading pool activity ...';

  const tokens = {
    tokenA: base.address === data[0].tokenA ? base : quote,
    tokenB: quote.address === data[0].tokenB ? quote : base,
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type) => <span>{type.toUpperCase()}</span>,
    },
    {
      title: `Amount ${tokens.tokenA.symbol}`,
      dataIndex: 'amountAMin',
      render: (amountAMin, activity) => {
        const num = activity.tokenA === tokens.tokenA.symbol ? amountAMin : activity.amountAMin;
        return numberWithSpaces(tokenToDecimals(num, tokens.tokenA.decimals).toFixed(6));
      },
    },
    {
      title: `Amount ${tokens.tokenB.symbol}`,
      dataIndex: 'amountBMin',
      render: (amountBMin, activity) => {
        const num = activity.tokenB === tokens.tokenB.symbol ? amountBMin : activity.amountBMin;
        return numberWithSpaces(tokenToDecimals(num, tokens.tokenB.decimals).toFixed(6));
      },
    },
    {
      title: 'Date',
      dataIndex: 'time',
      render: (time) => new Date(time).toLocaleString(),
    },
  ];

  return (
    <CustomTable>
      <ScrollBox>
        <PlusIcon />
        <MinusIcon />
        <Table
          rowStyle={(item) => ({
            fontWeight: '700',
            color:
              item.side === 'BUY'
                ? 'var(--theme-success-secondary-color)'
                : 'var(--theme-error-secondary-color)',
          })}
          bordered
          columns={columns}
          data={data}
        />
      </ScrollBox>
    </CustomTable>
  );
});
