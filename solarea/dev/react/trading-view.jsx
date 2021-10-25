const TradingView = await require('/charting_library/charting_library.standalone.js');

const TradingViewComponent = ({ token, datafeed }) => {
  const widget = React.useRef();

  const [isDarkTheme] = solarea.useLocalStorageState('dark_theme', false);
  console.log(isDarkTheme);

  const container = React.useMemo(() => 'tv_chart_container_' + Math.random().toString().slice(2), [
    token,
  ]);

  let getBlob = () => {
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue(
      '--theme-subcard-bg-color',
    );
    const bgColor2 = getComputedStyle(document.documentElement).getPropertyValue(
      '--theme-card-bg-color',
    );
    const mainColor = getComputedStyle(document.documentElement).getPropertyValue(
      '--theme-main-color',
    );
    const style = `
        --tv-color-toolbar-button-text: ${mainColor};
        --tv-color-toolbar-button-text-hover: ${mainColor};
        --tv-color-toolbar-button-background-hover: ${bgColor2};
        --tv-color-platform-background: ${bgColor};
        --tv-color-pane-background: ${bgColor};`;
    return new Blob(
      [
        `:root:not(.theme-dark) {
        ${style}
      }

      .theme-dark:root {
        ${style}
      }`,
      ],
      { type: 'text/css' },
    );
  };
  React.useEffect(() => {
    if (!widget.current || !widget.current._ready) return;
    widget.current.changeTheme(isDarkTheme ? 'Dark' : 'Light');
    widget.current.addCustomCSSFile(URL.createObjectURL(getBlob()));

    setTimeout(() => {
      widget.current.applyOverrides({
        'paneProperties.background': getComputedStyle(document.documentElement)
          .getPropertyValue('--theme-subcard-bg-color')
          .replace(' ', ''),
        'paneProperties.backgroundType': 'solid',
      });
    }, 0);
    // console.log(isDarkTheme, ' ---');
    // debugger;
    // widget.applyOverrides({ 'mainSeriesProperties.minTick': 'default' });
    // ;
  }, [isDarkTheme, widget.current]);
  // React.useEffect(() => {
  //   debugger;
  //   if (!widget.current || !widget.current._ready) return;
  //   setTimeout(() => {
  //     widget.current.applyOverrides({
  //       'paneProperties.background': getComputedStyle(document.documentElement)
  //         .getPropertyValue('--theme-subcard-bg-color')
  //         .replace(' ', ''),
  //       'paneProperties.backgroundType': 'solid',
  //     });
  //   }, 0);
  // }, [widget.current]);

  React.useLayoutEffect(() => {
    widget.current = new TradingView.widget({
      custom_css_url: URL.createObjectURL(getBlob()),
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      symbol: token,
      theme: isDarkTheme ? 'Dark' : 'Light',
      interval: '60',
      timeframe: '5D',
      datafeed,
      container,
      library_path: '/charting_library/',
      locale: 'en',
      // enabled_features: ['study_templates'],
      disabled_features: [
        'left_toolbar',
        // 'header_widget',
        // 'control_bar',
        'timeframes_toolbar',
        'legend_widget',
      ],
      charts_storage_api_version: '1.1',
      client_id: 'solarea',
      user_id: 'public_user_id',
      load_last_chart: true,
      width: '100%',
    });

    widget.current.onChartReady(() => {
      widget.current.applyOverrides({
        'paneProperties.background': getComputedStyle(document.documentElement)
          .getPropertyValue('--theme-subcard-bg-color')
          .replace(' ', ''),
        'paneProperties.backgroundType': 'solid',
      });
    });

    // debugger;
  }, [token]);

  return <div style={{ width: '100%' }} id={container} />;
};

add(TradingViewComponent);
