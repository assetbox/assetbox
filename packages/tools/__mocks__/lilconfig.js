/* eslint-disable no-undef */
const path = require("path");
import { vol } from "memfs";

const lilconfig = jest.createMockFromModule("lilconfig");

lilconfig.lilconfig = function () {
  return {
    search: async () =>
      vol.existsSync(path.resolve(process.cwd(), "assetbox.config.cjs"))
        ? {
            filepath: path.resolve(process.cwd(), "assetbox.config.cjs"),
            config: {
              assetPaths: ["./public/**/*", "./src/assets/**/*"],
            },
          }
        : null,
  };
};
module.exports = lilconfig;
