const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');

add(({ instruction }) => {
  const info = instruction.parsed.info;
  return (
    <div>
      <TwoColumn
        first="Vote account"
        second={<Hash hash={info.voteAccount} type="address" alignRight />}
      />
      <TwoColumn
        first="Vote authority"
        second={<Hash hash={info.voteAuthority} type="address" alignRight />}
      />
      <TwoColumn first="Vote hash" second={<Hash hash={info.vote.hash} alignRight />} />
      <TwoColumn first="Slots" second={info.vote.slots.join(', ')} alignRight />
    </div>
  );
});
