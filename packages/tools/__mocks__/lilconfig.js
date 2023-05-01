/* eslint-disable no-undef */
const path = require("path");

const lilconfig = jest.createMockFromModule("lilconfig");

lilconfig.lilconfig = function () {
  return {
    search: async () => ({
      filepath: path.resolve(process.cwd(), "assetbox.config.cjs"),
      config: {
        assetPaths: ["./public/**/*", "./src/assets/**/*"],
      },
    }),
  };
};
module.exports = lilconfig;
