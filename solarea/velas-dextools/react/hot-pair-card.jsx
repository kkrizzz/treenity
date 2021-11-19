const DashboardCard = render('dev', 'dashboard-card');

const { numberWithSpaces } = await require('solarea://explorer/utils');

const HotPairCard = ({ price, count, base_symbol, quote_symbol, large = true }) => {
  if (large)
    return (
      <DashboardCard subcard style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ fontWeight: 600 }}>
            {base_symbol}{' '}
            <span style={{ color: 'var(--theme-main-content-color)' }}>/ {quote_symbol}</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>{price}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 12, marginTop: 10, alignItems: 'center' }}>
          <div style={{ color: 'var(--theme-a-color)', marginRight: 16 }}>
            trades: {numberWithSpaces(count)}
          </div>
          <div style={{ color: 'var(--theme-success-color)', marginRight: 16 }}>
            buy: {numberWithSpaces(count / 2)}
          </div>
          <div style={{ color: 'var(--theme-error-color)', marginRight: 'auto' }}>
            sell: {numberWithSpaces(count / 2)}
          </div>

          <SmallBar count={count} sell={count / 2} />
        </div>
      </DashboardCard>
    );

  return (
    <DashboardCard subcard style={{ marginBottom: 10 }}>
      <SmallHotPairContainer>
        <div className="HotPair_symbol">
          {base_symbol}{' '}
          <span style={{ color: 'var(--theme-main-content-color)' }}>/ {quote_symbol}</span>
        </div>
        <div className="HotPair_stats">
          <span style={{ color: 'var(--theme-a-color)' }}>{numberWithSpaces(count)}</span>/
          <span style={{ color: 'var(--theme-success-color)' }}>{numberWithSpaces(count / 2)}</span>
          /<span style={{ color: 'var(--theme-error-color)' }}>{numberWithSpaces(count / 2)}</span>
        </div>

        <SmallBar count={count} sell={count / 2} small />

        <div className="HotPair_price">{price}</div>
      </SmallHotPairContainer>
    </DashboardCard>
  );
};

const SmallHotPairContainer = styled.div`
  display: flex;
  align-items: center;

  .HotPair_symbol {
    width: 30%;
    font-weight: 600;
  }
  .HotPair_stats {
    color: var(--theme-main-content-color);
    margin-right: 20px;
    width: 140px;
    font-size: 14px;
  }
  .HotPair_price {
    margin-left: auto;
    min-width: 88px;
    text-align: right;
  }

  @media screen and (max-width: 1620px) {
    .HotPair_symbol,
    .HotPair_price {
      font-size: 14px;
    }
    .HotPair_stats {
      font-size: 12px;
    }
  }
`;

const SmallBar = styled(({ className }) => (
  <div className={className}>
    <div />
  </div>
))`
  margin-right: ${(p) => (p.small ? 12 : 0)}px;
  background: ${({ theme }) => theme.colors.error};
  width: ${(p) => (p.small ? 100 : 200)}px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;

  & > div {
    background: ${({ theme }) => theme.colors.success};
    width: calc(100% * ${({ count, sell }) => sell / count});
    height: 100%;
  }

  @media screen and (max-width: 1024px) {
    & {
      display: ${(p) => (p.small ? 'none' : 'block')};
    }
  }
`;

add(HotPairCard);
