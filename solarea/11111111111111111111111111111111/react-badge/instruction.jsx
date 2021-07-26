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
  const instNo = solarea.bs58.decode(instruction.data)[0];

  return <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});
