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

add(({ instruction }) => {
  console.log(instruction);
  const instNo = instruction.data[0];

  return (
    <Render id="dev" name="bulma-card" header={<span>{SystemInstructionType[instNo]}</span>}>
      <table class="tablebul">
        <tr>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </Render>
  );

  // <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});
