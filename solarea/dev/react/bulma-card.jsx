add((props) => {
  return (
    <div
      class="bu-card m-b-8"
      style={{ borderRadius: 12, padding: 0, boxShadow: 'none !important' }}
    >
      {props.header && (
        <header class="bu-card-header">
          <p class="bu-card-header-title">{props.header}</p>
        </header>
      )}
      {props.children && <div class="bu-card-content">{props.children}</div>}
    </div>
  );
});
