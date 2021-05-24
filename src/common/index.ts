import './array-remove';
import { FeathersError } from '@feathersjs/errors';

// set status getter to return `code` to transfer error to rest
Object.defineProperty(FeathersError.prototype, 'status', {
  get() {
    return this.code;
  },
});
