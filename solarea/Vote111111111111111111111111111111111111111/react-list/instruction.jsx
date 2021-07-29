const BulmaCard = render('dev', 'bulma-card');

add(({ instruction }) => {
  const instNo = instruction.data[0];
  console.log(instNo);
  return `System VOTE`;
});
