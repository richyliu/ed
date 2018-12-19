module.exports = {
  staticFileGlobs: [
    'docs/index.html',
    'docs/**.css',
    'docs/**.js',
    'docs/assets/**',
  ],
  swFilePath: './docs/service-worker.js',
  templateFilePath: './service-worker.tmpl',
  stripPrefix: 'docs/',
  handleFetch: true,
  runtimeCaching: [
    {
      urlPattern: /.*localhost.*/,
      handler: 'networkFirst',
    },
    {
      urlPattern: /^https:\/\/rliu.me\/.*/,
      handler: 'networkFirst',
    },
  ],
  maximumFileSizeToCacheInBytes: 10485760, // 10 mb
};
