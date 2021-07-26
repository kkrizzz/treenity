const SystemInstructionType = [
  'createAccount',
  'createAccountWithSeed',
  'allocate',
  'allocateWithSeed',
  'assign',
  'assignWithSeed',
  'transfer',
  'advanceNonce',
  'withdrawNonce',
  'authorizeNonce',
  'initializeNonce',
  'transferWithSeed',
];

add(async ({ instruction }) => {
  const instNo = solarea.bs58.decode(instruction.data)[0];

  return (
    <Render
      id="dev"
      name="bulma-card"
      header={<span>{SystemInstructionType[instNo]}</span>}
    >
      <table>

      </table>
    </Render>
  );


  <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});
