const jazz = await require('https://unpkg.com/solarea-jazzicon@0.0.2/dist/index.js');
const Jazzicon = jazz.default;

add((props) => {
  const { style, className } = props;
  const address = typeof props.address === 'string' ? props.address : props.address?.toBase58();
  const isEth = props.isEth;
  const ref = React.useRef(null);

  React.useLayoutEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = '';
      ref.current.className = className || '';
      ref.current.replaceWith(
        Jazzicon(
          props.width || 16,
          isEth
            ? parseInt(props.address, 16)
            : parseInt(solarea.bs58.decode(address).toString('hex').slice(5, 15), 16),
        ),
      );
    }
  }, [address, style, className]);

  return <div ref={ref} style={props.style} />;
});
