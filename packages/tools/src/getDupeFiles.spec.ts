jest.mock("fs");
jest.mock("fs/promises");
import { expect, jest, test } from "@jest/globals";
import { vol } from "memfs";
import process from "process";

import { getDupeFiles } from "./getDupeFiles";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./test/utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("findDupeFileFromGlob Test", () => {
  describe("getDupeFiles Test", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/basic");
      createMockRepository("/test/basic", {
        assetBoxConfig: true,
        isDupe: false,
      });
    });

    test("getDupeFiles Test", async () => {
      const files = [
        {
          path: "/test/basic/src/assets/icons/d.svg",
          hash: "a87ff679a2f3e71d9181a67b7542122c",
        },
        {
          path: "/test/basic/src/assets/icons/qwe.svg",
          hash: "eccbc87e4b5ce2fe28308fd9f2a7baf5",
        },
      ];

      const { categories } = await readAssetBoxConfig();
      const assetFiles = Object.values(categories).flat();
      const result = await getDupeFiles(assetFiles, files);

      expect(result).toStrictEqual({
        "src/assets/icons/d.svg": ["src/assets/icons/d.svg"],
        "src/assets/icons/qwe.svg": [],
      });
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/basic", { recursive: true });
    });
  });
});
