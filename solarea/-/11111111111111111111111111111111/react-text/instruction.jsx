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
  const type = instruction.parsed
    ? instruction.parsed.type
    : SystemInstructionType[instruction.data[0]];

  return `System: ${type}`;
});
