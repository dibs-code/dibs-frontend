// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/v1',
      createProxyMiddleware({
        target: process.env.REACT_APP_MUON_API_URL,
        changeOrigin: true,
      }),
    );
  }
};
