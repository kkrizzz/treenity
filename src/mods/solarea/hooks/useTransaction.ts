import { ConfirmedTransaction, ParsedConfirmedTransaction } from '@solana/web3.js';
import { useSolanaRpc } from './useSolanaRpc';

export function useTransaction(
  signature: string,
  parsed: boolean = false,
): [ConfirmedTransaction | ParsedConfirmedTransaction | null, boolean] {
  const args = parsed ? [signature, 'jsonParsed'] : [signature];
  // @ts-ignore
  return useSolanaRpc('getConfirmedTransaction', args);

  // useMemo(() => {
  //   if (!parsed && !isLoading && transaction) {
  //     // @ts-ignore
  //     transaction.transaction.message = transaction.transaction.compileMessage();
  //   }
  // }, [transaction, isLoading]);

  // return [transaction || null, isLoading];
}
