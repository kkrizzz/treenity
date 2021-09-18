await require('https://unpkg.com/@solarea/bulma@0.9.3/all/bulma.prefixed.css');
require('https://fonts.googleapis.com/css?family=Roboto%20Mono&.css');
require('https://fonts.googleapis.com/css?family=Roboto&.css');

add(() => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div class="bu-has-text-black bu-is-size-1">Near portfolio</div>
      <div style={{ maxWidth: 300 }} class="bu-has-text-black bu-is-size-4">
        You can view your default portfolio dashboard which includes or build custom
      </div>
    </div>
  );
});
