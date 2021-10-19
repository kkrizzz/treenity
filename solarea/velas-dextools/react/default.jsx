const { useBitQueryTokenInfo } = await require('solarea://velas-dextools/utils');
const Hash = render('dev', 'hash');
const DashboardCard = render('dev', 'dashboard-card');

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
  return (
    <div className="bu-columns">
      <div className="bu-column bu-is-6">
        <DashboardCard title="About Velas dextools" size="large">
          <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500 }}>
            View price charts for any token in your velas wallet
          </div>
        </DashboardCard>
        <DashboardCard title="Some feature" size="large">
          <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}>
            Will be available soon...
          </div>
        </DashboardCard>
        <DashboardCard title="Some other feature" size="large">
          <div style={{ fontSize: '1rem', marginTop: 16, fontWeight: 500, color: '#989898' }}>
            Will be available soon...
          </div>
        </DashboardCard>
      </div>
      <div className="bu-column bu-is-6">
        <DashboardCard
          title={
            <span>
              Hot pairs <span style={{ color: 'gray', fontSize: '0.8rem' }}>(24h)</span>
            </span>
          }
          size="large"
        >
          <div
            style={{
              fontSize: '1rem',
              marginTop: 28,
              padding: '0 0.75rem',
              fontWeight: 500,
            }}
          >
            {/*<div className="bu-columns">*/}
            {/*  <div className="bu-column bu-is-1">#</div>*/}
            {/*  <div className="bu-column">Name</div>*/}
            {/*  <div className="bu-column  bu-is-3">Trades count</div>*/}
            {/*  <div className="bu-column  bu-is-2 bu-has-text-right">Price</div>*/}
            {/*</div>*/}

            {['LOL', 'KEK', 'AKKS', 'OKS', 'OKS', 'OKS'].map((token, index) => (
              <div className="bu-columns" style={styles[index]}>
                <div className="bu-column bu-is-1">#{index + 1}</div>
                <div className="bu-column" style={{ fontWeight: 700, color: '#464646' }}>
                  {token}
                </div>
                <div className="bu-column  bu-is-3">{Math.round(Math.random() * 1000)} trades</div>
                <div
                  className="bu-column  bu-is-2 bu-has-text-right"
                  style={{ color: Math.random() > 0.5 ? 'green' : 'red' }}
                >
                  ${12324}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
});
