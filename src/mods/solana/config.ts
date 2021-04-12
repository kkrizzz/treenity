export const MONGO_SERVICE_URL = process.env.NODE_ENV === 'production'
  ? '/solana/api'
  : 'http://localhost:3100/solana';

export const SESSION_SERVICE_URL = process.env.NODE_ENV === 'production'
    ? '/solarea/sessionid'
    : 'http://localhost:3100/solarea/sessionid';


export const VALIDATE_SERVICE_URL = process.env.NODE_ENV === 'production'
    ? '/solarea/validate'
    : 'http://localhost:3100/solarea/validate';

export const BITQUERY_BASE = 'https://graphql.bitquery.io/';