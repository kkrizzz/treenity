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

add(({ id, instruction }) => {
  return (
    <Render
      id="dev"
      name="bulma-card"
      header={<Render id={id} name="instruction" context="react-text" instruction={instruction} />}
    >
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
