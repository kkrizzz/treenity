import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const SOLANA_RENT_FEE = 19.055441478439427;
export const calcRentFee = (fileSizeBytes: number) => {
  return (SOLANA_RENT_FEE * (128 + fileSizeBytes + 34)) / LAMPORTS_PER_SOL;
};
