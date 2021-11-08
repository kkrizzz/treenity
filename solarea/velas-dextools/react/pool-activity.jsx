await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const Hash = render('velas-dextools', 'hash');
const ScrollBox = render('dev', 'scroll-box');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const { useLiquidityPoolsActivity } = await require('solarea://velas-dextools/utils');

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line
      x1="5.5"
      x2="5.5"
      y2="11"
      stroke="var(--theme-success-color)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="11"
      y1="5.5"
      y2="5.5"
      stroke="var(--theme-success-color)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line
      x1="11"
      y1="5.5"
      y2="5.5"
      stroke="var(--theme-error-color)"
      strokeWidth="2"
      strokeLinecap="round"
    />
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

const Info = styled.div`
  padding: 1rem;
  font-size: 1rem;
`;

add(({ market }) => {
  const { base, quote } = market;
  const [data, isLoading] = useLiquidityPoolsActivity(base.address, quote.address, 10);

  if (isLoading) return <Info>Loading pool activity ...</Info>;
  if (!data || !data.length) return <Info>No pool activity found</Info>;

  const tokens = {
    tokenA: base.address === data[0].tokenA ? base : quote,
    tokenB: quote.address === data[0].tokenB ? quote : base,
  };

  const columns = [
    {
      title: '',
      dataIndex: 'type',

      render: (type) => (type === 'add' ? <PlusIcon /> : <MinusIcon />),
    },
    {
      title: 'Date',
      dataIndex: 'time',
      render: (time) => (
        <span style={{ color: 'var(--theme-main-content-color)' }}>
          {new Date(time).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type) => <span>{type.toUpperCase()}</span>,
    },
    {
      title: `${tokens.tokenA.symbol} amount`,
      dataIndex: 'amountA',
      render: (amountA) => {
        return numberWithSpaces(amountA.toFixed(4));
      },
    },
    {
      title: `${tokens.tokenB.symbol} amount`,
      dataIndex: 'amountB',
      render: (amountB) => {
        return numberWithSpaces(amountB.toFixed(4));
      },
    },
    {
      title: 'From',
      dataIndex: 'from',
      render: (from) => {
        return (
          <div style={{ maxWidth: 120 }}>
            <Hash type="custom" hash={from} customLink={`//velas.solarea.io/address/${from}`} />
          </div>
        );
      },
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      render: (hash) => (
        <div style={{ maxWidth: 120 }}>
          <Hash type="custom" hash={hash} customLink={`//velas.solarea.io/tx/${hash}`} />
        </div>
      ),
    },
  ];

  return (
    <CustomTable>
      <ScrollBox>
        <Table
          rowStyle={(item) => ({
            color:
              item.type === 'add'
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
