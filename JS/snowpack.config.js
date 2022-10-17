// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/',
  },
  plugins: [
    /* ... */
    ['@snowpack/plugin-typescript'],
  ],
  packageOptions: {
    /* ... */
    source: 'local',
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    out: '../wwwroot/js/',
    clean: true,
    // ssr: true,
  },
  exclude: [
    '.git/',
    '.gitignore',
    'package.json',
    'scripts/*',
    'src/_zOld/*',
    'node_modules/*',
    'package-lock.json',
    'Procfile',
    'static.json',
    '.env',
    '*/**/__tests__/*',
    '**.css',
    'src/index.php',
    'src/favicon.ico',
  ],
};
