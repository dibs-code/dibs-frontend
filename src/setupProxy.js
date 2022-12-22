// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // if (process.env.NODE_ENV === 'development') {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'https://dibs-shield.muon.net/',
      changeOrigin: true,
    }),
  );
  // }
};
