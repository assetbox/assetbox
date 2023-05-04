/* eslint-disable no-undef */
const path = require("path");
import { vol } from "memfs";

const lilconfig = jest.createMockFromModule("lilconfig");

lilconfig.lilconfig = function () {
  return {
    search: async () => {
      if (vol.existsSync(path.resolve(process.cwd(), "assetbox.config.json"))) {
        const data = JSON.parse(
          vol.readFileSync(
            path.resolve(process.cwd(), "assetbox.config.json"),
            "utf-8"
          )
        );

        return {
          filepath: path.resolve(process.cwd(), "assetbox.config.json"),
          config: { assetPaths: data.assetPaths },
        };
      } else return null;
    },
  };
};

module.exports = lilconfig;
