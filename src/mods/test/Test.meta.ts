import { meta } from '../../treenity/meta/meta.model';
import { randomId } from '../../common/random-id';

export const TestMeta = meta(
  'test-meta',
  {
    name: '',
  },
  (self) => ({
    doSomething() {
      self.name = 'doing' + randomId();
    },
  }),
);
