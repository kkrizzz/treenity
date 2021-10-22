const { useBitQueryTokenInfo, useHotTokenPairs } = await require('solarea://velas-dextools/utils');
const Hash = render('dev', 'hash');
const Link = render('dev', 'link');
const DashboardCard = render('dev', 'dashboard-card');
const DashboardSection = render('dev', 'dashboard-section');

const styles = [
  {
    background: 'rgba(255,215,0,0.3)',
    borderRadius: 8,
    marginBottom: '1rem',
  },
  {
    // background: 'rgba(192,192,192,0.3)',
    // borderRadius: 8,
    // marginBottom: '1rem',
  },
  {
    // background: 'rgba(205,127,50, 0.3)',
    // borderRadius: 8,
  },
];

add(() => {
  const [hotTokens, isHotTokensLoading] = useHotTokenPairs();
  return (
    <div className="bu-columns">
      <div className="bu-column bu-is-6">
        <DashboardCard title="About Velas dextools" size="large">
          <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500 }}>
            View price charts for any token in your velas wallet
          </div>
        </DashboardCard>
        <DashboardSection style={{ marginLeft: 4 }} title="Features">
          <DashboardCard title="Pair explorer" size="large">
            <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}>
              View detailed pool info (pooled value, count of trades, trading value)
            </div>
          </DashboardCard>
          <DashboardCard title="Wallet info" size="large">
            <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}>
              Will be available soon...
            </div>
          </DashboardCard>
          <DashboardCard title="Big swap explorer" size="large">
            <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}>
              Will be available soon...
            </div>
          </DashboardCard>
        </DashboardSection>
      </div>
      <div className="bu-column bu-is-6">
        <DashboardCard
          title={
            <span>
              Hot pairs <span style={{ color: 'gray', fontSize: '0.8rem' }}>(5d)</span>
            </span>
          }
          size="large"
        >
          <div
            style={{
              fontSize: '1rem',
              marginTop: 28,
              fontWeight: 500,
            }}
          >
            {/*<div className="bu-columns">*/}
            {/*  <div className="bu-column bu-is-1">#</div>*/}
            {/*  <div className="bu-column">Name</div>*/}
            {/*  <div className="bu-column  bu-is-3">Trades count</div>*/}
            {/*  <div className="bu-column  bu-is-2 bu-has-text-right">Price</div>*/}
            {/*</div>*/}

            {isHotTokensLoading ? (
              <div>
                Loading hottest pairs...
                <span className="spinner-grow spinner-grow-sm m-r-4" />
              </div>
            ) : hotTokens && hotTokens.length ? (
              hotTokens.map(
                (
                  { _id: { base_address, base_symbol, quote_address, quote_symbol }, count, price },
                  index,
                ) => (
                  <div className="bu-columns" style={styles[index]}>
                    <div className="bu-column bu-is-1">#{index + 1}</div>
                    <div className="bu-column" style={{ fontWeight: 700, color: '#464646' }}>
                      <Link to={`/${base_address}`}>
                        {base_symbol}/{quote_symbol}
                      </Link>
                    </div>
                    <div className="bu-column  bu-is-3">{count} trades</div>
                  </div>
                ),
              )
            ) : (
              'No token trades in last 24 hr'
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
});
