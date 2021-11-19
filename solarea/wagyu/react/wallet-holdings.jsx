add(({ wallet }) => {
  wallet = wallet.toLowerCase();
  const addr = wallet.startsWith('0x') ? wallet.slice(2) : wallet;

  // const [data, isLoading] = solarea.useSolanaRpc('eth_call', [
  //   {
  //     to: '0xa7e8280b8ce4f87dfefc3d1f2254b5ccd971e852',
  //     data: `0x1175a1dd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000${addr}`,
  //   },
  //   'latest',
  // ]);

  const [data, isLoading] = solarea.useSolanaRpc('eth_call', [
    {
      to: '0x0fe86ee7437608f8b8f6185dab1667ac44e0b59b',
      data: `0x1959a002000000000000000000000000${addr}`,
    },
    'latest',
  ]);

  if (isLoading) return 'loading';

  const data1 = data.slice(0, 34);
  const data2 = data.slice(34, 34 + 32);
  const data3 = data.slice(34 + 32, 34 + 32 + 32);
  const data4 = data.slice(34 + 32 + 32, 34 + 32 + 32 + 32);

  return (
    <div>
      <pre>{parseInt(data1, 16) / Math.pow(10, 18)}</pre>
      <pre>{parseInt(data2, 16) / Math.pow(10, 18)}</pre>
      <pre>{parseInt(data3, 16) / Math.pow(10, 18)}</pre>
      <pre>{parseInt(data4, 16) / Math.pow(10, 18)}</pre>
    </div>
  );
});
