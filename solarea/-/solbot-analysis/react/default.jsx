const { PublicKey, Connection } = SolWeb3;

const SOLANA_MAINNET_CLUSTER = 'https://api.mainnet-beta.solana.com';

const BOT_PUBLIC_KEY = new PublicKey('BossNYX1ELRTYZmxb6h2o86ktgrXTExdDymEDim65Nq3');

const connection = new Connection(SOLANA_MAINNET_CLUSTER);

const TpsMetric = render('solbot-analysis', 'success-tx-per-hour');

add(() => {
  const { data: accTxs, isLoading: isAccTxsLoading } = solarea.useQuery(
    ['acc-txs', BOT_PUBLIC_KEY.toString()],
    () => connection.getSignaturesForAddress(BOT_PUBLIC_KEY),
  );

  if (isAccTxsLoading) return 'Loading tx';

  console.log(accTxs);

  const successTxs = React.useMemo(() => accTxs.filter((tx) => !tx.err), [accTxs]);
  const failedTxs = React.useMemo(() => accTxs.filter((tx) => tx.err), [accTxs]);

  const burnedFee = failedTxs.length * 0.000005;

  const latestTxBlockTime = new Date(1000 * accTxs[accTxs.length - 1].blockTime);
  const firstTxBlockTime = new Date(1000 * accTxs[0].blockTime);

  return (
    <div>
      <div>
        <h1>Stats on latest 1000 txs</h1>
        <p>
          Success: {successTxs.length}. Failed: {failedTxs.length}
          <br />
          Burned fee: {burnedFee.toFixed(5)} SOL. (~ {(burnedFee * 90).toFixed(5)}$)
          <br />
          TPM:{' '}
          {(
            (firstTxBlockTime.getTime() - latestTxBlockTime.getTime()) /
            accTxs.length /
            1000 /
            60
          ).toFixed(5)}
        </p>
      </div>

      <div>
        <h2>Latest bot ss tx</h2>
        <div>
          {successTxs.map((i) => (
            <div style={{ fontFamily: 'monospace' }}>
              {i.signature}:{' '}
              <span style={{ color: '#43b17b' }}>
                {new Date(1000 * i.blockTime).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Latest bot fail tx</h2>
        <div></div>
      </div>
      <div>
        <TpsMetric />
      </div>
    </div>
  );
});
