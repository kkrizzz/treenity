const {
  clusterApiUrl,
  Connection,
  Account,
  AccountMeta,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Loader,
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} = require('@solana/web3.js');

//////////////////////////////////////////////
// var Writable = require('stream').Writable;

/* Writable memory stream */
// class MemoryStream extends Writable {
//   public buffer: Buffer;
//
//   constructor(options?: any) {
//     super(options); // init super
//     this.buffer = Buffer.from(0); // empty
//   }
//
//   _write(chunk, enc, cb) {
//     // our memory store stores things in buffers
//     const buffer = Buffer.isBuffer(chunk)
//       ? chunk // already is Buffer use it
//       : new Buffer(chunk, enc); // string, convert
//
//     // concat to the buffer already there
//     this.buffer = Buffer.concat([this.buffer, buffer]);
//     cb();
//   }
// }

/////////////

const SystemProgramID = '11111111111111111111111111111111';
// const SolareaProgramID = new PublicKey('Bc7EqXL6vTZGqojKbDREQThqkP21SA61txidboSyRbi8');
const SolareaProgramID = new PublicKey('GCzSA27wo8UZEszsHDHR88GfTRTySKta56mjPxAinc2S');
// const privateKey = [217, 63, 39, 126, 105, 43, 228, 153, 61, 88, 0, 19, 230, 98, 199, 244, 153, 75, 36, 40, 246, 253, 93, 90, 162, 184, 192, 182, 1, 177, 207, 32, 252, 197, 76, 229, 53, 56, 212, 196, 154, 103, 65, 165, 49, 147, 115, 6, 205, 244, 148, 102, 152, 181, 2, 52, 139, 194, 140, 128, 224, 188, 199, 252,];
const privateKey = [
  247,
  88,
  186,
  211,
  21,
  31,
  118,
  115,
  175,
  18,
  228,
  232,
  252,
  64,
  135,
  131,
  36,
  148,
  209,
  46,
  4,
  162,
  20,
  131,
  21,
  38,
  68,
  49,
  78,
  254,
  48,
  48,
  106,
  102,
  173,
  95,
  238,
  24,
  89,
  154,
  27,
  79,
  95,
  192,
  42,
  150,
  208,
  217,
  57,
  71,
  29,
  102,
  184,
  212,
  12,
  169,
  214,
  220,
  80,
  242,
  214,
  200,
  41,
  92,
];

async function main() {
  const url = clusterApiUrl('devnet');
  const connection = new Connection(url);
  const wallet = new Account(privateKey);
  // const newAcc = new Account();

  const address = 'some-address';
  const context = 'react';
  const name = 'default1';
  const seed = Buffer.from(address + '|' + context + '|' + name);
  const [storageAddress, byte] = await PublicKey.findProgramAddress([seed], SolareaProgramID);

  const data = 'add(() => <div>Hello Solarea!</div>)';
  const area_size = 32 + 2 + data.length;

  //////////////////// create account transaction
  const cidSize = 1 + 1 + address.length + 1 + context.length + 1 + 1 + name.length + 4 + 2;
  const cid = Buffer.alloc(cidSize); // create_instruction_data
  let offset = 0;
  cid.writeUInt8(1, offset); // instruction 'create' = 1
  cid.writeUInt8(address.length, (offset += 1));
  cid.write(address, (offset += 1));
  cid.writeUInt8(context.length, (offset += address.length));
  cid.write(context, (offset += 1));
  cid.writeUInt8(name.length, (offset += context.length));
  cid.write(name, (offset += 1));
  cid.writeUInt8(byte, (offset += name.length));
  cid.writeUInt32LE(area_size, (offset += 1));
  cid.writeUInt16LE(0x1, (offset += 4));
  const createInstruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: storageAddress, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, iisSigner: false, isWritable: false },
    ],
    programId: SolareaProgramID,
    data: cid,
  });

  ///////////////// store
  const sidSize = 1 + 4 + data.length;
  const sid = Buffer.alloc(sidSize); // store_instruction_data
  offset = 0;
  sid.writeUInt8(2, (offset += 0)); // instruction 'store' = 2
  sid.writeUInt32LE(0x1, (offset += 1)); // data type = 'react view'
  sid.write(data, (offset += 4)); // data

  const storeInstruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: storageAddress, isSigner: false, isWritable: true },
    ],
    programId: SolareaProgramID,
    data: sid,
  });

  /////////////////// remove
  const rid = Buffer.alloc(1); // remove_instruction_data
  rid.writeUInt8(3); // instruction 'remove' = 3

  const removeInstruction = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: storageAddress, isSigner: false, isWritable: true },
    ],
    programId: SolareaProgramID,
    data: rid,
  });

  const transaction = new Transaction().add(
    createInstruction,
    storeInstruction
    removeInstruction,
  );

  await sendAndConfirmTransaction(connection, transaction, [wallet]);
}

main().then(console.log, console.error);
