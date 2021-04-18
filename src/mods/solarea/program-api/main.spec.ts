import SolareaProgramApi from './solarea-program-api';

const {
  clusterApiUrl,
  Connection,
  Account,
  Transaction,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

import privateKey from './id.json';

async function main() {
  const url = clusterApiUrl('devnet');
  const connection = new Connection(url);
  const wallet = new Account(privateKey);
  const solareaApi = new SolareaProgramApi();
  // const newAcc = new Account();

  const address = 'test-address';
  const context = 'react';
  const name = 'default';

  // const data = Buffer.from('add(() => <div>Hello Solarea!</div>)');
  const data = Buffer.alloc(1024);
  data.write('add(() => <div>Hello Solarea!</div>)');
  data.write('!!', 1022);

  const [createInstruction, storageAddress] = solareaApi.createInstruction(
    wallet.publicKey,
    address,
    context,
    name,
    data.length,
    0x1,
  );
  const storeInstruction = solareaApi.storeInstruction(wallet.publicKey, storageAddress, data, 0);
  const removeInstruction = solareaApi.removeInstruction(wallet.publicKey, storageAddress);
  //
  // const transaction = new Transaction().add(
  //   createInstruction,
  //   storeInstruction
  //   // removeInstruction,
  // );
  const [firstTransaction, ...otherTransaction] = solareaApi.createTransactions(
    wallet.publicKey,
    address,
    context,
    name,
    data,
    0x1,
  );

  // await sendAndConfirmTransaction(connection, new Transaction().add(removeInstruction), [wallet], {
  //   commitment: 'finalized',
  // });
  await sendAndConfirmTransaction(connection, firstTransaction, [wallet], {
    commitment: 'finalized',
  });
  await sendAndConfirmTransaction(connection, otherTransaction[0], [wallet], {
    commitment: 'finalized',
  });

  // console.log('loaded to ', storageAddress.toBase58(), 'sucessfully');
}

main().then(console.log, console.error);
