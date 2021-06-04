import { MigrationSet } from 'migrate';
import { promisify } from 'util';

import migrations from './migrations';

const MIGRATION_ID = 'migration';
const createStore = (app) => ({
  save(data, cb) {
    const { lastRun, migrations } = data;
    return app
      .service('config')
      .Model.update({ _id: MIGRATION_ID }, { $set: { lastRun, migrations } }, { upsert: true })
      .then((res) => (cb?.(null, data), res), cb);
  },
  load(cb?: any) {
    return app
      .service('config')
      .get(MIGRATION_ID)
      .catch(() => undefined);
  },
});

export default async function doMigrate(app) {
  const mongoStore = createStore(app);
  const set = new MigrationSet(mongoStore);
  // load and restore config from mongo
  const config = await mongoStore.load();
  set.lastRun = config?.lastRun;

  migrations(app).forEach((m) => {
    set.addMigration(...m);
  });

  if (config?.migrations) {
    set.migrations.forEach((m) => {
      m.timestamp = config.migrations.find((cm) => cm.title === m.title)?.timestamp;
    });
  }

  // run up migrations
  await promisify((cb) => set.up(cb))();
  await promisify((cb) => set.save(cb))();

  console.log('migrations successfully ran');
}
