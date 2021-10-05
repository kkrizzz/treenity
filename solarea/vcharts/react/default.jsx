const { useBitQueryTokenInfo } = await require('solarea://velas-dextools/utils');

const VelasCandleChart = render('vcharts', 'candle-chart');

add(() => {
  const [tokenInfo, isTokenInfoLoading] = useBitQueryTokenInfo(
    '0x580de58c1bd593a43dadcf0a739d504621817c05',
  );
  return (
    <div>
      <div>
        {isTokenInfoLoading ? <div>Loading token info ...</div> : <div>{tokenInfo.symbol}/BNB</div>}
      </div>
      <VelasCandleChart coin="0x580de58c1bd593a43dadcf0a739d504621817c05" />
    </div>
  );
});
