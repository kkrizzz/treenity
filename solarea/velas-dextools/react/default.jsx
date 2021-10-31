const {
  useBitQueryTokenInfo,
  useHotTokenPairs,
  useLatestBigSwaps,
} = await require('solarea://velas-dextools/utils');
const Hash = render('dev', 'hash');
const Link = render('dev', 'link');
const ImportantActions = render('velas-dextools', 'important-actions');
const DashboardCard = render('dev', 'dashboard-card');
const DashboardSection = render('dev', 'dashboard-section');

const styles = [
  {
    background: 'rgba(253,248,196,0.13)',
    filter: 'brightness(130%)',
    borderRadius: 8,
    marginBottom: '1rem',
  },
];

add(() => {
  const [hotTokens, isHotTokensLoading] = useHotTokenPairs();

  return (
    <div>
      <div className="bu-columns">
        <div className="bu-column bu-is-6">
          <DashboardSection
            style={{ marginLeft: 4 }}
            title={
              <span>
                Hot pairs <span style={{ color: 'gray', fontSize: '0.8rem' }}>(5d)</span>
              </span>
            }
          >
            <DashboardCard size="large">
              <div
                style={{
                  fontSize: '1rem',
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
                      {
                        _id: { base_address, base_symbol, quote_address, quote_symbol },
                        count,
                        price,
                      },
                      index,
                    ) => (
                      <div className="bu-columns bu-is-mobile" style={styles[index]}>
                        <div className="bu-column bu-is-1">#{index + 1}</div>
                        <div className="bu-column" style={{ fontWeight: 700, color: '#464646' }}>
                          <Link to={`/${base_address}?quote=${quote_address}`}>
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
          </DashboardSection>
        </div>
        <div className="bu-column bu-is-6">
          <DashboardSection
            style={{ marginLeft: 4 }}
            title={
              <span>
                Latest important actions{' '}
                <span style={{ color: 'gray', fontSize: '0.8rem' }}>(5d)</span>
              </span>
            }
          >
            <DashboardCard size="large">
              <ImportantActions />
            </DashboardCard>
          </DashboardSection>
        </div>
      </div>
      {/*      <div className="bu-columns">
        <div className="bu-column bu-is-12">
          <DashboardSection style={{ marginLeft: 4 }} title="Features">
            <div class="bu-columns">
              <div class="bu-column bu-is-4">
                <DashboardCard title="Pair explorer" size="large">
                  <div
                    style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}
                  >
                    View detailed pool info (pooled value, count of trades, trading value)
                  </div>
                </DashboardCard>
              </div>
              <div className="bu-column bu-is-4">
                <DashboardCard title="Wallet info" size="large">
                  <div
                    style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}
                  >
                    Will be available soon...
                  </div>
                </DashboardCard>
              </div>
              <div className="bu-column bu-is-4">
                <DashboardCard title="Big swap explorer" size="large">
                  <div
                    style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}
                  >
                    Will be available soon...
                  </div>
                </DashboardCard>
              </div>
            </div>
          </DashboardSection>
        </div>
      </div>*/}
    </div>
  );
});
