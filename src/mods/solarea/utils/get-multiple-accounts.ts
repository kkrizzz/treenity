import { Connection } from '@solana/web3.js';

/**
 * Solana RPC method, not listed in current web3 library
 * @param connection
 * @param publicKeys
 * @param commitment
 */
export async function getMultipleAccounts(connection: Connection, publicKeys, commitment) {
  const args = connection._buildArgs(
    [publicKeys.map((key) => key.toBase58())],
    commitment,
    'base64',
  );

  // @ts-ignore
  const res = await connection._rpcRequest('getMultipleAccounts', args);

  if ('error' in res) {
    throw new Error('failed to get info about multiple accounts');
  }

  return res.result;
}
