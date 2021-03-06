export const MONGO_SERVICE_URL = process.env.NODE_ENV === 'production'
  ? '/solana/api'
  : 'http://localhost:3100/solana/api';
