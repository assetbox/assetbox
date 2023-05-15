jest.mock("fs");
jest.mock("fs/promises");
import { expect, jest, test } from "@jest/globals";
import { vol } from "memfs";
import process from "process";

import { findDupeFileSet } from "./findDupeFileSet";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./test/utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("findDupeFileFromGlob Test", () => {
  describe("Dupe Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/basic");
      createMockRepository("/test/basic", {
        assetBoxConfig: true,
        isDupe: true,
      });
    });

    test("findDupeFileSet Test", async () => {
      const { categories } = await readAssetBoxConfig();
      const assetFiles = Object.values(categories).flat();

      const result = await findDupeFileSet(assetFiles);

      expect(result).toStrictEqual([
        ["/test/basic/public/b_copy.png", "/test/basic/public/b.png"],
        ["/test/basic/public/a_copy.png", "/test/basic/public/a.png"],
      ]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/basic", { recursive: true });
    });
  });

  describe("Dedupe Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/basic");
      createMockRepository("/test/basic", {
        assetBoxConfig: true,
        isDupe: false,
      });
    });

    test("findDupeFileSet Test", async () => {
      const { categories } = await readAssetBoxConfig();
      const assetFiles = Object.values(categories).flat();

      const result = await findDupeFileSet(assetFiles);

      expect(result).toStrictEqual([]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/basic", { recursive: true });
    });
  });
});
