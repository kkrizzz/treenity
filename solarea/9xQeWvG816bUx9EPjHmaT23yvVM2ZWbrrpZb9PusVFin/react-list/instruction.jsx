const SERUM_CODE_LOOKUP = {
  0: 'Initialize Market',
  1: 'New Order',
  2: 'Match Orders',
  3: 'Consume Events',
  4: 'Cancel Order',
  5: 'Settle Funds',
  6: 'Cancel Order By Client Id',
  7: 'Disable Market',
  8: 'Sweep Fees',
  9: 'New Order',
  10: 'New Order',
  11: 'Cancel Order',
  12: 'Cancel Order By Client Id',
  13: 'Send Take',
};

const BulmaCard = render('dev', 'bulma-card');
const InstText = render('', 'instruction', 'react-text');
const AccName = render('', 'name', 'react-text');

add(({ id, instruction }) => {
  const data = instruction.data;
  const instNo = (data[0] << 8) | data[1];

  const programId = instruction.programId.toBase58();
  return (
    <BulmaCard header={<InstText id={id} instruction={instruction} />}>
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
    </BulmaCard>
  );
});
