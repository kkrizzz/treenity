const DashboardCard = render('dev', 'dashboard-card');

const HotPairCard = ({ price, count, base_symbol, quote_symbol, large = true }) => {
  if (large)
    return (
      <DashboardCard subcard style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ fontWeight: 600 }}>
            {base_symbol}{' '}
            <span style={{ color: 'var(--theme-main-content-color)' }}>/ {quote_symbol}</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>${price}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 12, marginTop: 10, alignItems: 'center' }}>
          <div style={{ color: 'var(--theme-a-color)', marginRight: 16 }}>trades: {count}</div>
          <div style={{ color: 'var(--theme-success-color)', marginRight: 16 }}>
            buy: {count / 2}
          </div>
          <div style={{ color: 'var(--theme-error-color)', marginRight: 'auto' }}>
            sell: {count / 2}
          </div>

          <SmallBar count={count} sell={count / 2} />
        </div>
      </DashboardCard>
    );

  return (
    <DashboardCard subcard style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, width: '30%' }}>
          {base_symbol}{' '}
          <span style={{ color: 'var(--theme-main-content-color)' }}>/ {quote_symbol}</span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: 'var(--theme-main-content-color)',
            marginRight: 20,
            width: 140,
          }}
        >
          <span style={{ color: 'var(--theme-a-color)' }}>{count}</span>/
          <span style={{ color: 'var(--theme-success-color)' }}>{count / 2}</span>/
          <span style={{ color: 'var(--theme-error-color)' }}>{count / 2}</span>
        </div>

        <SmallBar count={count} sell={count / 2} small />

        <div style={{ marginLeft: 'auto' }}>${price}</div>
      </div>
    </DashboardCard>
  );
};

const SmallBar = styled(({ className }) => (
  <div className={className}>
    <div />
  </div>
))`
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

  @media screen and (max-width: 600px) {
    & {
      display: ${(p) => (p.small ? 'none' : 'block')};
    }
  }
`;

add(HotPairCard);
