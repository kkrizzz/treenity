import bs58 from 'bs58';
import { ConfirmedTransaction, ParsedConfirmedTransaction } from '@solana/web3.js';
import { useSolanaRpc } from './useSolanaRpc';

export function useTransaction(
  signature: string,
  parsed: boolean = false,
): [ConfirmedTransaction | ParsedConfirmedTransaction | null, boolean] {
  const args = parsed ? [signature, 'jsonParsed'] : [signature];
  // @ts-ignore
  return useSolanaRpc('getConfirmedTransaction', args, {
    transform(result) {
      result.transaction.message.instructions.forEach((i) => {
        if (typeof i.data === 'string') i.data = bs58.decode(i.data);
      });
      return result;
    },
  });

  // useMemo(() => {
  //   if (!parsed && !isLoading && transaction) {
  //     // @ts-ignore
  //     transaction.transaction.message = transaction.transaction.compileMessage();
  //   }
  // }, [transaction, isLoading]);

  // return [transaction || null, isLoading];
}
