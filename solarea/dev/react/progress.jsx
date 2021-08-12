add(({ percent }) => {
  return (
    <progress className="bu-progress bu-is-small bu-is-success" value={percent} max="100">
      {percent}%
    </progress>
  );
});
