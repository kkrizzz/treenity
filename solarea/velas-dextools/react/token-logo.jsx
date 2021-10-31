const RandomImageWithNonce = render('dev', 'random-image-with-nonce');

const getTokenLogoURL = (address) => {
  return `https://raw.githubusercontent.com/wagyuswapapp/assets/master/blockchains/velas/assets/${address.toLowerCase()}/logo.png`;
};

const useTokenLogo = (address) => {
  const tokenLogoUrl = getTokenLogoURL(address);

  const { data, isLoading } = solarea.useQuery(
    ['token_logo', address],
    () =>
      fetch(tokenLogoUrl).then((res) => {
        return res.blob();
      }),
    { retry: false },
  );

  return [data, isLoading];
};

add(({ address }) => {
  const [tokenImg, isTokenImgLoading] = useTokenLogo(address);
  if (isTokenImgLoading) return <span className="spinner-grow spinner-grow-sm m-r-4" />;

  const imgUrl = tokenImg ? URL.createObjectURL(tokenImg) : undefined;

  return (
    <div>
      {tokenImg && tokenImg.size > 14 ? (
        <img src={imgUrl} width={63} />
      ) : (
        <RandomImageWithNonce width={64} isEth={true} address={address} />
      )}
    </div>
  );
});
