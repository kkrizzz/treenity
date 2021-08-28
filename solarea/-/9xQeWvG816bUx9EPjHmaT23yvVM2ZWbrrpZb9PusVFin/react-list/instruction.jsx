const NamedHash = render('dev', 'named-hash');

add(({ id, instruction }) => {
  // const data = instruction.data;
  //
  const programId = instruction.programId;
  return (
    <ul>
      <li>
        ProgramId: <NamedHash hash={programId} type="address" />
      </li>
      {instruction.accounts.map((pubkey, i) => (
        <li key={i}>
          <NamedHash hash={pubkey} type="address" />
        </li>
      ))}
    </ul>
  );
});
