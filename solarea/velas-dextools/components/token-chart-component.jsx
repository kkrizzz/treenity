const CandleChart = render('velas-dextools', 'candle-chart');

add(({ base, quote, chartName }) => {
  return (
    <div className="bu-columns" style={{ flexFlow: 'wrap' }}>
      <div className="bu-column">
        <CandleChart token={chartName} base={base} quote={quote} />
      </div>
    </div>
  );
});
