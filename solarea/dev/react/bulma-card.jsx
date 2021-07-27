add((props) => {
  return (
    <div class="bu-card m-b-8">
      <header class="bu-card-header">
        <p class="bu-card-header-title">{props.header}</p>
      </header>
      {props.children && (
        <div class="bu-card-content">
          <div class="bu-content">{props.children}</div>
        </div>
      )}
    </div>
  );
});
