import createClientDb from '../../mods/mongo/mongod';

export default [
  '_001_renameSolanaIds',
  async function (app) {
    const db = await createClientDb(app);
    const solana = db.collection('solarea');

    const items = await solana.find({}).toArray();
    for (let i = 0; i < items.length; i++) {
      const { _id, ...item } = items[i];
      if (_id.includes('_')) {
        await solana.insertOne({ ...item, _id: _id.replace(/_/g, '~') });
        await solana.remove({ _id });
      }
    }
  },
];
