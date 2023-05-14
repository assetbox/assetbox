jest.mock("fs");
jest.mock("fs/promises");
import { expect, jest, test } from "@jest/globals";
import memfs, { vol } from "memfs";
import process from "process";

import { findDupeFileSet } from "./findDupeFileSet";
import { findFilePathsFromGlob } from "./findFilePathsFromGlob";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./testUtils/mockRepository";

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

    test("findFilePathsFromGlob Test", async () => {
      const config = await readAssetBoxConfig();
      const assetFiles = await findFilePathsFromGlob(config.assetPaths, {
        fs: memfs,
      });

      const result = await findDupeFileSet(assetFiles);

      expect(result).toStrictEqual([
        ["/test/basic/public/b_copy.png", "/test/basic/public/b.png"],
        [
          "/test/basic/public/a_copy.png",
          "/test/basic/public/a.png",
          "/test/basic/src/assets/a.png",
        ],
      ]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/basic", { recursive: true });
    });
  });

  describe("Not Dupe Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/basic");
      createMockRepository("/test/basic", {
        assetBoxConfig: true,
        isDupe: false,
      });
    });

    test("findFilePathsFromGlob Test", async () => {
      const config = await readAssetBoxConfig();
      const assetFiles = await findFilePathsFromGlob(config.assetPaths, {
        fs: memfs,
      });

      const result = await findDupeFileSet(assetFiles);

      expect(result).toStrictEqual([]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/basic", { recursive: true });
    });
  });
});
