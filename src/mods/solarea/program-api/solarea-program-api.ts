import { Transaction } from '@solana/web3.js';

const {
  SystemProgram,
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} = require('@solana/web3.js');

import { findProgramAddress } from './find-program-address';
import { add } from 'winston';

// first one
// const SolareaProgramID = new PublicKey('Bc7EqXL6vTZGqojKbDREQThqkP21SA61txidboSyRbi8');
const SolareaProgramID = new PublicKey('xj2vZrbvct4XkHe54vZrepYVwoXxaPB4BQSfnSxJ7h2');

export function createViewAddress(address: string, context: string, name: string) {
  return findProgramAddress([address, '|', context, '|', name], SolareaProgramID);
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

export default class SolareaProgramApi {
  createInstruction(
    walletPub: typeof PublicKey,
    address: string,
    context: string,
    name: string,
    dataLength: number,
    dataType: number,
  ): [typeof TransactionInstruction, typeof PublicKey] {
    const [storagePub, byte] = createViewAddress(address, context, name);
    //////////////////// create account transaction
    const areaSize = 32 + 2 + dataLength;
    const bufSize = 1 + 1 + address.length + 1 + context.length + 1 + 1 + name.length + 4 + 2;
    let offset: number = 0;
    const buf = Buffer.alloc(bufSize); // create_instruction_data
    buf.writeUInt8(1, offset); // instruction 'create' = 1
    buf.writeUInt8(address.length, (offset += 1));
    buf.write(address, (offset += 1));
    buf.writeUInt8(context.length, (offset += address.length));
    buf.write(context, (offset += 1));
    buf.writeUInt8(name.length, (offset += context.length));
    buf.write(name, (offset += 1));
    buf.writeUInt8(byte, (offset += name.length));
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
  ): Transaction[] {
    const instructions: typeof TransactionInstruction[] = [];

    const [createInst, storagePub] = this.createInstruction(
      walletPub,
      address,
      context,
      name,
      data.length,
      dataType,
    );

    if (isUpdate) {
      const removeInstruction = this.removeInstruction(walletPub, storagePub);
      instructions.push(removeInstruction);
    }

    const firstDataSize =
      1024 - ((isUpdate ? 82 : 82) + address.length + context.length + name.length);

    const chunk = data.slice(0, firstDataSize);
    const storeInst = this.storeInstruction(walletPub, storagePub, chunk, 0);

    const transactions = [new Transaction().add(...instructions, createInst, storeInst)];

    let remainLength = data.length - firstDataSize;
    let offset = firstDataSize;

    while (remainLength > 0) {
      const chunk = data.slice(offset, DATA_CHUNK_MAX);
      const storeInst = this.storeInstruction(walletPub, storagePub, chunk, offset);
      transactions.push(new Transaction().add(storeInst));

      remainLength -= DATA_CHUNK_MAX;
      offset += DATA_CHUNK_MAX;
    }

    return transactions;
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
}
