const { Chart } = await require('https://cdn.jsdelivr.net/npm/chart.js');

add(({ labels, data, className, max = undefined }) => {
  const canvas = React.useRef();
  console.log(labels, data);

  React.useLayoutEffect(() => {
    const ctx = canvas.current.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            borderColor: '#00cccc',
            backgroundColor: '#00000000',
            data,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            suggestedMax: 5.1,
          },
        },
      },
    });
  }, [data]);

  return (
    <div className={className}>
      <canvas ref={canvas}></canvas>
    </div>
  );
});
