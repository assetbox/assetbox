/* eslint-disable no-undef */
const path = require("path");
import { vol } from "memfs";

const lilconfig = jest.createMockFromModule("lilconfig");

lilconfig.lilconfig = function () {
  return {
    search: async () =>
      vol.existsSync(path.resolve(process.cwd(), "assetbox.config.json"))
        ? JSON.parse(
            vol.readFileSync(
              path.resolve(process.cwd(), "assetbox.config.json"),
              "utf-8"
            )
          ).assetPaths.length === 0
          ? {
              filepath: path.resolve(process.cwd(), "assetbox.config.json"),
              config: {
                assetPaths: [],
              },
            }
          : {
              filepath: path.resolve(process.cwd(), "assetbox.config.json"),
              config: {
                assetPaths: ["./public/**/*", "./src/assets/**/*"],
              },
            }
        : null,
  };
};
module.exports = lilconfig;
