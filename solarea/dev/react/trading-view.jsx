const TradingView = await require('/charting_library/charting_library.standalone.js');

const TradingViewComponent = ({ token, datafeed }) => {
  const widget = React.useRef();
  const container = React.useMemo(() => 'tv_chart_container_' + Math.random().toString().slice(2), [
    token,
  ]);
  React.useLayoutEffect(() => {
    widget.current = new TradingView.widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      symbol: token,
      interval: '1',
      datafeed,
      container,
      library_path: '/charting_library/',
      locale: 'en',
      // enabled_features: ['study_templates'],
      disabled_features: [
        'left_toolbar',
        // 'header_widget',
        // 'control_bar',
        // 'timeframes_toolbar',
        'legend_widget',
      ],
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      load_last_chart: true,
      width: '100%',
    });
  }, [token]);

  return <div style={{ width: '100%' }} id={container} />;
};

add(TradingViewComponent);
