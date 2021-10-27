const CandleChart = render('velas-dextools', 'candle-chart');

const tokenChartStruct = await require(`solarea://velas-dextools/token-chart/components`);

add(({ base, quote }) => {
  const options = tokenChartStruct.props[0].options;

  const baseSymbol = options.find((i) => i.value === base);
  const quoteSymbol = options.find((i) => i.value === quote);
  return (
    <div className="bu-columns" style={{ flexFlow: 'wrap' }}>
      <div className="bu-column">
        <CandleChart token={`${baseSymbol.label}/${quoteSymbol.label}`} base={base} quote={quote} />
      </div>
    </div>
  );
});
