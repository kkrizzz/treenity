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
  const data = solarea.bs58.decode(instruction.data);
  const instNo = data[0];

  return {
    data,
    name: SystemInstructionType[instNo],
  };
});
