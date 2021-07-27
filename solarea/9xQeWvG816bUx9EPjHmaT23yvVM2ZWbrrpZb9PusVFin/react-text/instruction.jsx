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

add(({ instruction }) => {
  const data = instruction.data;
  const instNo = (data[0] << 8) | data[1];

  return `Serum V3: ${SERUM_CODE_LOOKUP[instNo]}`;
});
