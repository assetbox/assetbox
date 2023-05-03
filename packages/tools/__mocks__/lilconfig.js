/* eslint-disable no-undef */
const path = require("path");
import { vol } from "memfs";

const lilconfig = jest.createMockFromModule("lilconfig");

lilconfig.lilconfig = function () {
  return {
    search: async () =>
      vol.existsSync(path.resolve(process.cwd(), "assetbox.config.cjs"))
        ? vol
            .readFileSync(
              path.resolve(process.cwd(), "assetbox.config.cjs"),
              "utf-8"
            )
            .slice(27, 41) === "assetPaths: []"
          ? {
              filepath: path.resolve(process.cwd(), "assetbox.config.cjs"),
              config: {
                assetPaths: [],
              },
            }
          : {
              filepath: path.resolve(process.cwd(), "assetbox.config.cjs"),
              config: {
                assetPaths: ["./public/**/*", "./src/assets/**/*"],
              },
            }
        : null,
  };
};
module.exports = lilconfig;
