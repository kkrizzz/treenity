require('../../common/array-at');
require('../../utils/promise-sequence');
// if (env.NODE_ENV === 'development') {
//   require('preact/debug');
// }
const config = require('../../config-common');
config.isClient = true;

require('./client');
