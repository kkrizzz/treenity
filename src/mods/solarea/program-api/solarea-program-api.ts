import { Transaction } from '@solana/web3.js';

const {
  SystemProgram,
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} = require('@solana/web3.js');

import { findProgramAddress, Seed } from './find-program-address';

// first one
// const SolareaProgramID = new PublicKey('Bc7EqXL6vTZGqojKbDREQThqkP21SA61txidboSyRbi8');
// const SolareaProgramID = new PublicKey('xj2vZrbvct4XkHe54vZrepYVwoXxaPB4BQSfnSxJ7h2');
const SolareaProgramID = new PublicKey('HLxwJdvLFherjE3wm7Jy5q2PpE49wDdAKxaA2BS7H8AX');

function addrToBuffer(address: Seed): Seed {
  return address.length > 32 ? new PublicKey(address).toBuffer() : address;
}

export function createViewAddress(address: Seed, context: Seed, name: Seed) {
  return findProgramAddress([addrToBuffer(address), '~', context, '~', name], SolareaProgramID);
}

function createSolareaInstruction(
  walletPub: typeof PublicKey,
  storagePub: typeof PublicKey,
  data: Buffer,
  otherKeys: typeof PublicKey[] = [],
): typeof TransactionInstruction {
  return new TransactionInstruction({
    keys: [
      { pubkey: walletPub, isSigner: true, isWritable: true },
      { pubkey: storagePub, isSigner: false, isWritable: true },
      ...otherKeys.map((pubkey) => ({ pubkey, isSigner: false, isWritable: false })),
    ],
    programId: SolareaProgramID,
    data,
  });
}

const DATA_CHUNK_MAX = 1024;

function writeDynamicString(buf: Buffer, srcBuf: Seed, offset: number) {
  const len = srcBuf.length;
  buf.writeUInt8(len, offset);
  offset += 1;
  buf.fill(srcBuf, offset, offset + len);
  return len + 1;
}

export default class SolareaProgramApi {
  createInstruction(
    walletPub: typeof PublicKey,
    address: Seed,
    context: Seed,
    name: Seed,
    dataLength: number,
    dataType: number,
  ): [typeof TransactionInstruction, typeof PublicKey] {
    const [storagePub, byte] = createViewAddress(address, context, name);
    //////////////////// create account transaction
    const targetAddress = addrToBuffer(address);
    const areaSize = 32 + 2 + dataLength;
    const bufSize = 1 + 1 + targetAddress.length + 1 + context.length + 1 + 1 + name.length + 4 + 2;
    let offset: number = 0;
    const buf = Buffer.alloc(bufSize); // create_instruction_data
    buf.writeUInt8(1, offset++); // instruction 'create' = 1
    offset += writeDynamicString(buf, targetAddress, offset);
    offset += writeDynamicString(buf, context, offset);
    offset += writeDynamicString(buf, name, offset);
    buf.writeUInt8(byte, offset);
    buf.writeUInt32LE(areaSize, (offset += 1));
    buf.writeUInt16LE(dataType, (offset += 4));

    const createInstruction = createSolareaInstruction(walletPub, storagePub, buf, [
      SYSVAR_RENT_PUBKEY,
      SystemProgram.programId,
    ]);

    return [createInstruction, storagePub];
  }

  createTransactions(
    walletPub: typeof PublicKey,
    address: string,
    context: string,
    name: string,
    data: Buffer,
    dataType: number,
    isUpdate: boolean = false,
  ): [Transaction[], typeof PublicKey] {
    const [createInst, storagePub] = this.createInstruction(
      walletPub,
      address,
      context,
      name,
      data.length,
      dataType,
    );
    const firstDataSize = 1024 - (82 + addrToBuffer(address).length + context.length + name.length);

    const chunk = data.slice(0, firstDataSize);
    const storeInst = this.storeInstruction(walletPub, storagePub, chunk, 0);

    const transactions = [new Transaction().add(createInst, storeInst)];

    if (isUpdate) {
      transactions.unshift(new Transaction().add(this.removeInstruction(walletPub, storagePub)));
    }

    let remainLength = data.length - firstDataSize;
    let offset = firstDataSize;

    while (remainLength > 0) {
      const chunk = data.slice(offset, offset + DATA_CHUNK_MAX);
      const storeInst = this.storeInstruction(walletPub, storagePub, chunk, offset);
      transactions.push(new Transaction().add(storeInst));

      remainLength -= DATA_CHUNK_MAX;
      offset += DATA_CHUNK_MAX;
    }

    return [transactions, storagePub];
  }

  storeInstruction(
    walletPub: typeof PublicKey,
    storagePub: typeof PublicKey,
    data: Buffer,
    dataOffset: number,
  ): typeof TransactionInstruction {
    ///////////////// store
    const bufSize = 1 + 3 + data.length;
    const buf = Buffer.alloc(bufSize); // store_instruction_data
    let offset = 0;
    buf.writeUInt8(2, (offset += 0)); // instruction 'store' = 2
    buf.writeUInt32LE(dataOffset, (offset += 1)); // data type = 'react view'
    data.copy(buf, (offset += 3)); // data

    return createSolareaInstruction(walletPub, storagePub, buf);
  }

  removeInstruction(
    walletPub: typeof PublicKey,
    storagePub: typeof PublicKey,
  ): typeof TransactionInstruction {
    /////////////////// remove
    const buf = Buffer.from([0x3]); // instruction 'remove' = 3

    return createSolareaInstruction(walletPub, storagePub, buf);
  }

  unpackData(accountData: Buffer): { owner: typeof PublicKey; data: Buffer; type: number } {
    // '0113756e646566696e65642e6c6f63616c686f73740572656163740764656661756c74ff440000000100';
    const owner = new PublicKey(accountData.slice(0, 32));
    const type = accountData.readUInt8(32);
    const data = accountData.slice(34);
    return { owner, type, data };
  }
}
