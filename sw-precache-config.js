/**
 * See https://github.com/GoogleChromeLabs/sw-precache for configuration info
 */
module.exports = {
  staticFileGlobs: [
    'docs/index.html',
    'docs/**.css',
    'docs/**.js',
    'docs/assets/**',
  ],
  templateFilePath: './service-worker.tmpl',
  stripPrefix: 'docs/',
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
