module.exports = {
  webpack (config) {
    return { ...config, ignoreWarnings: [/Failed to parse source map/] };
  },
};
