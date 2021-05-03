import { Blockhash, clusterApiUrl } from '@solana/web3.js';
import { req } from './req';

export const getSolanaRecentBlockhash = async (
  cluster: 'devnet' | 'mainnet-beta' | 'testnet',
): Promise<string> => {
  const url = clusterApiUrl(cluster);
  const data = await req.post(url, {
    jsonrpc: '2.0',
    id: 1,
    method: 'getRecentBlockhash',
  });
  return (await data.json()).result.value.blockhash;
};
