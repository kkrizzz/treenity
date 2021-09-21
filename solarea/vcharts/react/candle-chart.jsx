const TradingViewCandleChart = render('dev', 'tradingview-candles');

const interval1day = 86400000;
const interval4hour = Math.floor(interval1day / 6);

const _head = (arr) => arr[0];
const _last = (arr) => arr[arr.length - 1];

const _minBy = function (arr, key) {
  const mapped = arr.map((i) => i[key]);
  const minValue = Math.min.apply(Math, mapped);
  return arr[mapped.indexOf(minValue)];
};

const _maxBy = function (arr, key) {
  const mapped = arr.map((i) => i[key]);
  const minValue = Math.min.apply(Math, mapped);
  return arr[mapped.indexOf(minValue)];
};

const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

add(({ coin, limit = 5000, interval = interval4hour }) => {
  const [data, isLoading] = useBitQuery(pancakeQuery(coin, limit));
  const [candles, setCandles] = React.useState(undefined);
  if (isLoading) return 'Loading dex trades...';

  React.useEffect(() => {
    const trades = data.data.ethereum.dexTrades;
    trades.forEach((i) => {
      const tradeTime = new Date(i.block.timestamp.time).getTime();
      i.group = Math.trunc(tradeTime / interval4hour);
    });

    const groupedTrades = groupBy(trades, 'group');

    const tradesAsCandles = Object.keys(groupedTrades).map((key, index) => {
      const group = groupedTrades[key];
      const number = Number(key);

      return {
        time: (number * interval4hour) / 1000,
        open: _last(group).quotePrice,
        high: _maxBy(group, 'quotePrice').quotePrice,
        low: _minBy(group, 'quotePrice').quotePrice,
        close: _head(group).quotePrice,
      };
    });

    setCandles(tradesAsCandles);
  }, [data, interval]);

  return <div>{candles && <TradingViewCandleChart candles={candles} />}</div>;
});

var pancakeQuery = (id, limit) => `
{
  ethereum(network: bsc) {
    dexTrades(
      baseCurrency: {is: "${id}"},
      quoteCurrency: { is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" },
      options: {desc: ["block.timestamp.time"], limit: ${limit}, offset: 0}
    ) {
      side
      exchange {
        address {
          address
        }
        name
      }
      block {
        timestamp {
          time
        }
      }
      baseCurrency {
        symbol
        address
      }
      quoteCurrency {
        symbol
        address
      }
      quotePrice
      tradeAmount(in: USD)
    }
  }
}
`;
