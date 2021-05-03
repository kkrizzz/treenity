import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import nacl from 'tweetnacl';

export type Seed = string | Buffer;

let sha256 = (buffer, options?: any) => {
  options = {
    outputFormat: 'hex',
    ...options,
  };

  const hash = crypto.createHash('sha256');
  // @ts-ignore
  hash.update(buffer, typeof buffer === 'string' ? 'utf8' : undefined);

  if (options.outputFormat === 'hex') {
    return hash.digest('hex');
  }

  return hash.digest().buffer;
};

// @ts-ignore
const nl = nacl.lowlevel;
let gf1 = nl.gf([1]);
let I = nl.gf([
  0xa0b0,
  0x4a0e,
  0x1b27,
  0xc4ee,
  0xe478,
  0xad2f,
  0x1806,
  0x2f43,
  0xd7a7,
  0x3dfb,
  0x0099,
  0x2b4d,
  0xdf0b,
  0x4fc1,
  0x2480,
  0x2b83,
]);

function neq25519(a, b) {
  var c = new Uint8Array(32),
    d = new Uint8Array(32);
  nl.pack25519(c, a);
  nl.pack25519(d, b);
  return nl.crypto_verify_32(c, 0, d, 0);
}

function is_on_curve(p) {
  let l = nl; // This type exists to workaround an esdoc parse error
  var r = [l.gf(), l.gf(), l.gf(), l.gf()];
  var t = l.gf(),
    c = l.gf(),
    n = l.gf(),
    d = l.gf(),
    d2 = l.gf(),
    d4 = l.gf(),
    d6 = l.gf();
  l.set25519(r[2], gf1);
  l.unpack25519(r[1], p);
  l.S(n, r[1]);
  l.M(d, n, l.D);
  l.Z(n, n, r[2]);
  l.A(d, r[2], d);
  l.S(d2, d);
  l.S(d4, d2);
  l.M(d6, d4, d2);
  l.M(t, d6, n);
  l.M(t, t, d);
  l.pow2523(t, t);
  l.M(t, t, n);
  l.M(t, t, d);
  l.M(t, t, d);
  l.M(r[0], t, d);
  l.S(c, r[0]);
  l.M(c, c, d);
  if (neq25519(c, n)) l.M(r[0], r[0], I);
  l.S(c, r[0]);
  l.M(c, c, d);
  if (neq25519(c, n)) return 0;
  return 1;
}

const programDerivedBuffer = Buffer.from('ProgramDerivedAddress');

function createProgramAddress(seeds, programId) {
  const bufs = seeds.map((seed) => {
    if (seed.length > 32) {
      throw new Error(`Max seed length exceeded`);
    }
    return Buffer.from(seed);
  });
  bufs.push(programId.toBuffer(), programDerivedBuffer);
  let hash = sha256(Buffer.concat(bufs), {});
  let publicKeyBytes = new BN(hash, 16).toArray(null, 32);

  if (is_on_curve(publicKeyBytes)) {
    throw new Error(`Invalid seeds, address must fall off the curve`);
  }

  return new PublicKey(publicKeyBytes);
}

export function findProgramAddress(
  seeds: Seed[],
  programId: typeof PublicKey,
): [PublicKey, number] {
  let nonce = 255;
  let error;

  while (nonce > 0) {
    try {
      const seedsWithNonce = seeds.concat(Buffer.from([nonce]));
      const address = createProgramAddress(seedsWithNonce, programId);

      return [address, nonce];
    } catch (err) {
      error = err;
      nonce--;
    }
  }

  throw new Error(`Unable to find a viable program address nonce: ${error!.message}`);
}
