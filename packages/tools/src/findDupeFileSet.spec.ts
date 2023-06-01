jest.mock("fs");
jest.mock("fs/promises");
import { expect, jest, test } from "@jest/globals";
import { vol } from "memfs";
import process from "process";

import { findDupeFileSet, isDupeFiles } from "./findDupeFileSet";
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
        ["public/b_copy.png", "public/b.png"],
        ["public/a_copy.png", "public/a.png"],
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

  describe("isDupeFiles Test", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/basic");
      createMockRepository("/test/basic", {
        assetBoxConfig: true,
        isDupe: false,
      });
    });

    test("isDupeFiles Test", async () => {
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
      const result = await isDupeFiles(assetFiles, files);

      expect(result).toStrictEqual({
        "src/assets/icons/d.svg": true,
        "src/assets/icons/qwe.svg": false,
      });
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/basic", { recursive: true });
    });
  });
});
