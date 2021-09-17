const {
  Chart,
} = await require('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js');

add(({ labels, data, className }) => {
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
            label: 'Total',
            data,
          },
        ],
      },
    });
  }, [data]);

  return (
    <div className={className}>
      <canvas ref={canvas}></canvas>
    </div>
  );
});
