const isProd = process.env.NODE_ENV === 'production';
export default {
  host: '127.0.0.1',
  port: isProd ? 5000 : 3100,

  isClient: false,
  isServer: false,
};
