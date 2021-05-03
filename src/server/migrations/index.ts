const migrations = [require('./001-rename-ids')];

const migrate = (name, fn, app) => [
  name,
  () => {
    try {
      console.log('migrating ', name);
      fn(app);
      console.log('done migrating ', name);
    } catch (err) {
      console.error('error migrating ', name, err);
    }
  },
];

export default (app) => migrations.map((r) => migrate(r.default[0], r.default[1], app));
