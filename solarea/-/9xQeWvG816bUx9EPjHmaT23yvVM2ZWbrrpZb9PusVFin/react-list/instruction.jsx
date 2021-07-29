const AccName = render('', 'name', 'react-text');

add(({ id, instruction }) => {
  const data = instruction.data;

  const programId = instruction.programId.toBase58();
  return (
    <ul>
      <li>
        ProgramId: <AccName id={programId} fallback={() => programId} />
      </li>
      {instruction.keys.map(({ pubkey }, i) => (
        <li key={i}>
          <AccName id={pubkey.toBase58()} fallback={() => pubkey.toBase58()} />
        </li>
      ))}
    </ul>
  );
});
