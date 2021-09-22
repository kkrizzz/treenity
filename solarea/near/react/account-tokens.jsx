const nearUtils = await require('solarea://near/utils');
const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const DashboardCard = render('dev', 'dashboard-card');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

const RenderTokens = ({ tokenData }) => {
  return tokenData ? (
    tokenData.map((tokenCollection) =>
      tokenCollection.tokens !== '0' ? (
        <DashboardCard>
          <TwoColumn
            first={
              <div style={{ alignItems: 'center', display: 'flex' }}>
                <img style={{ marginRight: 8 }} width={32} src={tokenCollection.metadata.icon} />
                <Hash type="account" alignRight hash={tokenCollection.contract}>
                  {tokenCollection.metadata.name}
                </Hash>
              </div>
            }
            second={tokensDecimalsPow(tokenCollection.tokens, tokenCollection.metadata.decimals)}
          />
        </DashboardCard>
      ) : null,
    )
  ) : (
    <div>No tokens</div>
  );
};

add(RenderTokens);
