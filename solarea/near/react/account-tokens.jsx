const nearUtils = await require('solarea://near/utils');
const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');

const tokensDecimalsPow = (amount, decimals, toFixed = 4) =>
  (amount * Math.pow(10, -decimals)).toFixed(toFixed);

const RenderTokens = ({ tokenData }) => {
  return tokenData ? (
    tokenData.map((tokenCollection) =>
      tokenCollection.tokens !== '0' ? (
        <div class="bu-box theme-inner-instruction inner-shadow">
          <div style={{ alignItems: 'center', display: 'flex', marginBottom: '1.5rem' }}>
            <img style={{ marginRight: 8 }} width={32} src={tokenCollection.metadata.icon} />
            <strong>{tokenCollection.metadata.name}</strong>
          </div>
          <TwoColumn
            first="Balance"
            second={tokensDecimalsPow(tokenCollection.tokens, tokenCollection.metadata.decimals)}
          />
          <TwoColumn
            first="Contract"
            second={<Hash type="account" alignRight hash={tokenCollection.contract} />}
          />
        </div>
      ) : null,
    )
  ) : (
    <div>No tokens</div>
  );
};

add(RenderTokens);
