add(({ success }) => {
  return (
    <div className={`bu-tag bu-is-${success ? 'success' : 'danger'}`}>
      {success ? 'Success' : 'Error'}
    </div>
  );
});
