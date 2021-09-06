add(({ id, instruction }) => {
  const type = instruction.parsed?.type;
  switch (type) {
    case 'evmTransfer':
      return 'EVM: Transfer';
    case 'swapNativeToEvm':
      return 'EVM: Swap native to EVM';
    default:
      return type ? `EVM: ${type}` : 'EVM Transaction';
  }
});
