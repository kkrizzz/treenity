const SystemInstructionType = [
  'createAccount', //done
  'createAccountWithSeed', //done
  'allocate', //done
  'allocateWithSeed',
  'assign', //done
  'assignWithSeed',
  'transfer', //done
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
