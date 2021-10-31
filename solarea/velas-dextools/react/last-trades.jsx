await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
const Table = render('dev', 'table');
const Hash = render('velas-dextools', 'hash');
const ScrollBox = render('dev', 'scroll-box');
const { numberWithSpaces } = await require('solarea://explorer/utils');
const { useLatestTokenTrades } = await require('solarea://velas-dextools/utils');

const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.66669 8.33335L8.33335 1.66669M8.33335 1.66669H1.66669M8.33335 1.66669V8.33335"
      stroke="var(--theme-success-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ArrowDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.66669 1.66669L8.33335 8.33335M8.33335 8.33335V1.66669M8.33335 8.33335H1.66669"
      stroke="var(--theme-error-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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

add(({ market }) => {
  const { base, quote } = market;
  const [data, isLoading] = useLatestTokenTrades(base.address, quote.address);
  if (isLoading) return 'Loading trades ...';

  const columns = [
    {
      title: '',
      dataIndex: 'side',

      render: (side) => (side === 'BUY' ? <ArrowUp /> : <ArrowDown />),
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
      title: 'Side',
      dataIndex: 'side',
    },
    {
      title: `${base.symbol}`,
      dataIndex: 'amount',
      render: (num, { qp }) => numberWithSpaces(num.toFixed(6)),
    },

    {
      title: `Total ${quote.symbol}`,
      dataIndex: 'amount',
      render: (num, { qp }) => numberWithSpaces((num / qp).toFixed(6)),
    },
    {
      title: 'Price',
      dataIndex: 'qp',
      render: (num) => numberWithSpaces((1 / num).toFixed(6)),
    },
    {
      title: 'From',
      dataIndex: 'tx',
      render: (tx) => {
        const address = tx.from.address;
        return (
          <div style={{ maxWidth: 120 }}>
            <Hash
              type="custom"
              hash={address}
              customLink={`//velas.solarea.io/address/${address}`}
            />
          </div>
        );
      },
    },
    {
      title: 'Hash',
      dataIndex: 'tx',
      render: (tx) => (
        <div style={{ maxWidth: 120 }}>
          <Hash type="custom" hash={tx.hash} customLink={`//velas.solarea.io/tx/${tx.hash}`} />
        </div>
      ),
    },
  ];

  return (
    <ScrollBox>
      <CustomTable>
        <Table
          rowStyle={(item) => ({
            color:
              item.side === 'BUY'
                ? 'var(--theme-success-secondary-color)'
                : 'var(--theme-error-secondary-color)',
          })}
          bordered
          columns={columns}
          data={data}
        />
      </CustomTable>
    </ScrollBox>
  );
});
