// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: "/",
  },
  plugins: [
    /* ... */
    ["@snowpack/plugin-typescript"],
  ],
  packageOptions: {
    /* ... */
    source: "local",
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
    clean: true,
    ssr: true,
  },
  exclude: [
    ".git/",
    ".gitignore",
    "package.json",
    "scripts/*",
    "node_modules/*",
    "package-lock.json",
    "Procfile",
    "static.json",
    ".env",
  ],
};
