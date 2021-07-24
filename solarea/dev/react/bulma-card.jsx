add((props) => {
  return (
    <div class="card m-b-8">
      <header class="card-header">
        <p class="card-header-title">{props.header}</p>
      </header>
      {props.children && (
        <div class="card-content">
          <div class="content">{props.children}</div>
        </div>
      )}
    </div>
  );
});
