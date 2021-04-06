export const MONGO_SERVICE_URL = process.env.NODE_ENV === 'production'
  ? '/solana/api'
  : 'http://localhost:3100/solana';

export const AUTH_SERVICE_URL = process.env.NODE_ENV === 'production'
    ? '/solarea/sessionid'
    : 'http://localhost:3100/solarea/sessionid';

export const BITQUERY_BASE = 'https://graphql.bitquery.io/';