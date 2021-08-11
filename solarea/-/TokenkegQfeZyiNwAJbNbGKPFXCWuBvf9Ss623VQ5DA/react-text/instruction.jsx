const TokenInstructionType = [
  'initializeMint',
  'initializeAccount',
  'initializeMultisig',
  'transfer',
  'approve',
  'revoke',
  'setAuthority',
  'mintTo',
  'burn',
  'closeAccount',
  'freezeAccount',
  'thawAccount',
  'transfer2',
  'approve2',
  'mintTo2',
  'burn2',
  'transferChecked',
  'approveChecked',
  'mintToChecked',
  'burnChecked',
];

add(({ instruction }) => {
  const instNo = instruction.data[0];
  return `SPL: ${TokenInstructionType[instNo]}`;
});
