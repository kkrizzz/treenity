const migrations = [require('./001-rename-ids')];
export default (app) => migrations.map((r) => [r.default.name, () => r.default(app)]);
