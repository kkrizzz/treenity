const { useLatestImportantActions } = await require('solarea://velas-dextools/utils');
const Hash = render('dev', 'hash');
const ScrollBox = render('dev', 'scroll-box');
const Table = render('dev', 'table');
const Link = render('dev', 'link');
const TimeAgo = render('dev', 'time-ago');
const NamedHash = render('dev', 'named-hash');

const { numberWithSpaces } = await require('solarea://explorer/utils');

const actionsResolverByType = {
  bigSwap: (trade) => {
    const roundedQuoteAmount = Math.round(trade.amount);
    const actionText = `Swapped ${roundedQuoteAmount} ${trade.quote.symbol} for ${(
      (1 / trade.qp) *
      roundedQuoteAmount
    ).toFixed(4)} ${trade.base.symbol}`;
    return (
      <>
        <div className="bu-column bu-is-8" style={{ fontWeight: 700, color: '#464646' }}>
          <Link to={`/${trade.base.address}?quote=${trade.quote.address}`}>{actionText}</Link>
        </div>
        <div className="bu-column bu-is-4">
          <TimeAgo date={trade.time} />
        </div>
      </>
    );
  },
  newPool: ({ base, quote, createdAt }) => {
    const actionText = `New pool ${base.symbol}/${quote.symbol} created`;
    return (
      <>
        <div className="bu-column bu-is-8" style={{ fontWeight: 700, color: '#464646' }}>
          <Link to={`/${base.address}?quote=${quote.address}`}>{actionText}</Link>
        </div>
        <div className="bu-column bu-is-4">
          <TimeAgo date={createdAt} />
        </div>
      </>
    );
  },
};

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

const columns = [
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
        <NamedHash hash={tx.from.address} type="address" />
      </div>
    ),
  },
  {
    title: 'Tx',
    dataIndex: 'tx',
    nonClickable: true,
    render: (tx) => (
      <div style={{ maxWidth: 120 }}>
        <Hash hash={tx.hash} type="address" />
      </div>
    ),
  },
  {
    title: 'Time',
    dataIndex: 'time',
    render: (time) => <TimeAgo date={time} />,
  },
];

add(() => {
  const [importantActions, isImportantActionsLoading] = useLatestImportantActions(10);

  if (isImportantActionsLoading) return <div>Loading</div>;
  return (
    <ScrollBox>
      <CustomTable>
        <Table
          bordered
          columns={columns}
          onRowClick={(trade) =>
            window.history.pushState({}, '', `/${trade.base.address}?quote=${trade.quote.address}`)
          }
          data={importantActions.filter((a) => a.actionType === 'bigSwap')}
        />
      </CustomTable>
    </ScrollBox>
  );
});
