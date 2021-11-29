const { useLatestImportantActions } = await require('solarea://velas-dextools/utils');
const Hash = render('dev', 'hash');
const ScrollBox = render('dev', 'scroll-box');
const Table = render('dev', 'table');
const Link = render('dev', 'link');
const TimeAgo = render('dev', 'time-ago');
const Tabs = render('velas-dextools', 'tabs');

const { numberWithSpaces } = await require('solarea://explorer/utils');

const swapColumns = [
  {
    title: 'From',
    dataIndex: 'amount',
    render: (amount, trade) => (
      <div style={{ position: 'relative' }}>
        {numberWithSpaces(Math.round(amount))} <b>{trade.quote.symbol}</b>
        <ArrowContainer>
          <ArrowIcon />
        </ArrowContainer>
      </div>
    ),
  },
  {
    title: 'To',
    dataIndex: 'amountB',
    render: (amountB, trade) => (
      <span>
        {numberWithSpaces(Math.round(amountB))} <b>{trade.base.symbol}</b>
      </span>
    ),
  },
  {
    title: 'Total USD',
    dataIndex: 'amountUSD',
    render: (amountUSD) => (
      <span>
        <b>$</b>
        {numberWithSpaces(Math.round(amountUSD))}
      </span>
    ),
  },
  {
    title: 'Maker',
    dataIndex: 'tx',
    nonClickable: true,
    render: (tx) => (
      <div style={{ maxWidth: 120 }}>
        <Hash
          hash={tx.from.address}
          type="custom"
          customLink={`//velas.solarea.io/address/${tx.from.address}`}
        />
      </div>
    ),
  },
  {
    title: 'Tx',
    dataIndex: 'tx',
    nonClickable: true,
    render: (tx) => (
      <div style={{ maxWidth: 120 }}>
        <Hash type="custom" hash={tx.hash} customLink={`//velas.solarea.io/tx/${tx.hash}`} />
      </div>
    ),
  },
  {
    title: 'Time',
    dataIndex: 'time',
    render: (time) => <TimeAgo date={time} />,
  },
];

const poolsColumns = [
  {
    title: 'Pair',
    dataIndex: 'base',
    render: (_, { base, quote }) => (
      <div style={{ fontWeight: 700 }}>
        <Link to={`/${base.address}?quote=${quote.address}`}>
          {base.symbol}/{quote.symbol}
        </Link>
      </div>
    ),
  },
  {
    title: 'Activity',
    dataIndex: 'base',
    render: () => <div>Created</div>,
  },
  {
    title: 'Time',
    dataIndex: 'createdAt',
    render: (createdAt) => <TimeAgo date={createdAt} />,
  },
  {
    title: 'Liquidity USD',
    dataIndex: 'amountUSD',
    render: (amountUSD) => (
      <span>
        <b>$</b>
        {numberWithSpaces(Math.round(amountUSD))}
      </span>
    ),
  },
];

add(() => {
  const [bigSwaps, isBigSwapsLoading] = useLatestImportantActions(10, 'bigSwaps');
  const [newPools, isNewPoolsLoading] = useLatestImportantActions(10, 'newPools');

  if (isBigSwapsLoading) return <div>Loading</div>;

  const tabs = [
    {
      name: 'Big swaps',
      content: () => (
        <ScrollBox>
          <CustomTable>
            <Table
              bordered
              columns={swapColumns}
              onRowClick={(trade) =>
                window.history.pushState(
                  {},
                  '',
                  `/${trade.base.address}?quote=${trade.quote.address}`,
                )
              }
              data={bigSwaps}
            />
          </CustomTable>
        </ScrollBox>
      ),
    },
    {
      name: 'Pools activity',
      content: () => (
        <ScrollBox>
          <CustomTable>
            <Table
              bordered
              columns={poolsColumns}
              data={newPools}
              onRowClick={(trade) =>
                window.history.pushState(
                  {},
                  '',
                  `/${trade.base.address}?quote=${trade.quote.address}`,
                )
              }
            />
          </CustomTable>
        </ScrollBox>
      ),
    },
    // {
    //   name: 'Pools activity2',
    //   content: () => (
    //     <div style={{ fontSize: 14, padding: '8px 16px 16px 16px' }}>
    //       <div
    //         className="bu-columns"
    //         style={{ fontWeight: 700, color: 'var(--theme-main-content-color)' }}
    //       >
    //         <div className="bu-column bu-is-8">Activity</div>
    //         <div className="bu-column bu-is-4">Time</div>
    //       </div>
    //       {importantActions.map(({ base, quote, createdAt }) => (
    //         <div className="bu-columns">
    //           <div className="bu-column bu-is-8" style={{ fontWeight: 700, color: '#464646' }}>
    //             <Link
    //               to={`/${base.address}?quote=${quote.address}`}
    //             >{`New pool ${base.symbol}/${quote.symbol} created`}</Link>
    //           </div>
    //           <div className="bu-column bu-is-4">
    //             <TimeAgo date={createdAt} />
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
  ];

  return <Tabs tabs={tabs} />;
});

const CustomTable = styled.div`
  thead {
    border-bottom: 1px solid var(--theme-main-border-color);
  }

  td {
    //color: inherit !important;
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

const ArrowContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: -24px;
  top: -2px;
  color: var(--theme-main-content-color);
`;

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="feather feather-arrow-right"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);
