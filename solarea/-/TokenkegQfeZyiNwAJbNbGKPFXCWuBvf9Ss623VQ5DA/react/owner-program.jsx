const { BufferLayout, SolanaLayout } = solarea;

const MintLayout = BufferLayout.struct([
  BufferLayout.u32('mintAuthorityOption'),
  SolanaLayout.publicKeyString('mintAuthority'),
  BufferLayout.nu64('supply'),
  BufferLayout.u8('decimals'),
  BufferLayout.u8('isInitialized'),
  BufferLayout.u32('freezeAuthorityOption'),
  SolanaLayout.publicKeyString('freezeAuthority'),
]);

const TwoColumn = render('dev', 'two-column');
const AccountName = render('', 'name', 'react-text', {
  fallback: ({ id }) => id,
});

add(({ account, entityId }) => {
  const decoded = MintLayout.decode(account.data);
  console.log(decoded);
  const [tokensData, isTokenLoading] = solarea.useGraphQL(
    '/solana/tokens',
    `{
    allTokens(filter: { address: "${entityId}" }) {
      chainId 
      logoURI
      symbol
      name
      decimals
      tags
      extensions
    } 
   }`,
  );

  const tokensInfo = tokensData?.data.allTokens?.[0];

  return (
    <div>
      <TwoColumn first="Name" second="Value" />
      <TwoColumn first="Supply" second={decoded.supply / Math.pow(10, decoded.decimals)} />
      <TwoColumn first="Decimals" second={decoded.decimals} />
      <TwoColumn first="mintAuthority" second={<AccountName id={decoded.mintAuthority} />} />
      <TwoColumn first="freezeAuthority" second={<AccountName id={decoded.freezeAuthority} />} />
      <TwoColumn first="Decimals" second={decoded.decimals} />
      {tokensInfo && (
        <TwoColumn first="Logo" second={<img src={tokensInfo.logoURI} width={64} height={64} />} />
      )}
      {tokensInfo &&
        ['name', 'symbol'].map((name) => (
          <TwoColumn first={name} second={tokensInfo[name].toString()} />
        ))}
    </div>
  );
});
