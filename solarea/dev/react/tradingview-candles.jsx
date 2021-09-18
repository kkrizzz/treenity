const tradingView = await require('https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js');
console.log(tradingView);
const { useNearCoinData } = await require('solarea://near/utils');
const DashboardSection = render('dev', 'dashboard-section');

const config = {
  timeScale: {
    timeVisible: true,
    tickMarkFormatter: (time, tickMarkType, locale) => {
      return new Date(time * 1000).toLocaleString(locale, { day: '2-digit', month: 'short' });
    },
  },
  grid: {
    vertLines: {
      color: 'rgb(43,48,56)',
      style: 1,
      visible: true,
    },
    horzLines: {
      color: 'rgb(43,48,56)',
      style: 1,
      visible: true,
      labelVisible: false,
    },
  },
  crosshair: {
    vertLine: {
      color: '#717171',
      width: 0.5,
      style: 1,
      visible: true,
      labelVisible: true,
    },
    horzLine: {
      color: '#717171',
      width: 0.5,
      style: 0,
      visible: true,
      labelVisible: true,
    },
    mode: 0,
  },
  priceScale: {
    entireTextOnly: true,
    drawTicks: true,
    autoScale: true,
    alignLabels: false,
    borderVisible: true,
    borderColor: '#555ffd',
    scaleMargins: {
      top: 0.3,
      bottom: 0.25,
    },
  },
  layout: {
    background: {
      type: 'solid',
      color: '#1e2026',
    },
    textColor: '#ffffff',
    fontSize: 14,
    fontFamily: 'Calibri',
  },
};

add(({ contract, width = 400, height = 300 }) => {
  const ref = React.useRef();
  const [nearTokenData, isNearTokenDataLoading] = useNearCoinData();

  const { data: tokenData, isLoading: isTokenDataLoading } = solarea.useQuery(
    [contract, 'token_chart_price_tradingview'],
    () => fetch(`/near/price/${contract}`).then((res) => res.json()),
  );

  React.useLayoutEffect(() => {
    if (!tokenData || !nearTokenData) return;
    const nearPrice = nearTokenData.market_data.current_price.usd;

    const chart = tradingView.createChart(ref.current, {
      width,
      height,
      localization: {
        locale: 'en-US',
        priceFormatter: (price) => {
          return '$' + parseFloat(price).toFixed(3);
        },
      },
    });

    chart.timeScale().fitContent();

    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData(
      tokenData.candles.map((i) => ({
        time: i.time,
        open: i.open * nearPrice,
        high: i.high * nearPrice,
        low: i.low * nearPrice,
        close: i.close * nearPrice,
      })),
    );
    chart.applyOptions(config);
  }, [tokenData, nearTokenData]);

  return (
    <DashboardSection title={tokenData? tokenData._id: 'Loading chart'}/USD>
      <div ref={ref}></div>
    </DashboardSection>
  );
});
