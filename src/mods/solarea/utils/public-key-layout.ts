import { PublicKey } from '@solana/web3.js';
import { blob, Layout } from '@solana/buffer-layout';
import * as BufferLayout from '@solana/buffer-layout';

/** @internal */
export const publicKey = (property = 'publicKey'): Layout => {
  const layout = blob(32, property);
  const encode = layout.encode.bind(layout);
  const decode = layout.decode.bind(layout);

  const publicKeyLayout = layout;

  publicKeyLayout.decode = (buffer: Buffer, offset: number) => {
    const src = decode(buffer, offset);
    return (new PublicKey(src) as unknown) as Buffer;
  };

  // @ts-ignore
  publicKeyLayout.encode = (publicKey: PublicKey, buffer: Buffer, offset: number) => {
    const src = publicKey.toBuffer();
    return encode(src, buffer, offset);
  };

  return publicKeyLayout;
};

/** @internal */
export const publicKeyString = (property = 'publicKey'): Layout => {
  const layout = blob(32, property);
  const encode = layout.encode.bind(layout);
  const decode = layout.decode.bind(layout);

  const publicKeyLayout = layout;

  publicKeyLayout.decode = (buffer: Buffer, offset: number) => {
    const src = decode(buffer, offset);
    return (new PublicKey(src).toBase58() as unknown) as Buffer;
  };

  // @ts-ignore
  publicKeyLayout.encode = (publicKey: PublicKey, buffer: Buffer, offset: number) => {
    const src = publicKey.toBuffer();
    return encode(src, buffer, offset);
  };

  return publicKeyLayout;
};
