add(({ success }) => {
  return (
    <div className={`tag is-${success ? 'success' : 'warning'}`}>
      {success ? 'Success' : 'Error'}
    </div>
  );
});
