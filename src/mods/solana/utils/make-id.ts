import { PublicKey, PublicKeyNonce } from '@solana/web3.js';
import memoize from 'lodash/memoize';

const PROGRAM_ID = new PublicKey('So11111111111111111111111111111111111111112');
const derivedKey = memoize(async function derivedKey(accountId, context, name): Promise<PublicKeyNonce> {
  return await PublicKey.findProgramAddress(
    [new PublicKey(accountId).toBuffer(), Buffer.from(`${context}/${name}`, 'utf8')],
    PROGRAM_ID,
  );
});

export function makeId(address: string, name: string, context: string): string {
  return `${address}_${context.replace(' ', '-')}_${name}`; //(await derivedKey(address, context, name))[0].toBase58();
}
