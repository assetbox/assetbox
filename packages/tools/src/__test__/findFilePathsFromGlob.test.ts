jest.mock("fs");
import { expect, jest, test } from "@jest/globals";
import memfs, { vol } from "memfs";
import process from "process";

import { findFilePathsFromGlob } from "../findFilePathsFromGlob";
import { readAssetBoxConfig } from "../readAssetBoxConfig";
import { createMockRepository } from "./utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("findFilePathsFromGlob Test", () => {
  describe("Normal Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/normal");
      createMockRepository("/test/normal", { assetBoxConfig: true });
    });

    test("findFilePathsFromGlob Test", async () => {
      const config = await readAssetBoxConfig();
      const result = await findFilePathsFromGlob(config.assetPaths, {
        fs: memfs,
      });

      expect(result).toStrictEqual([
        "/test/normal/public/mock.md",
        "/test/normal/public/b.png",
        "/test/normal/public/a.png",
        "/test/normal/src/assets/mock.md",
        "/test/normal/src/assets/d.png",
        "/test/normal/src/assets/c.png",
      ]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/normal", { recursive: true });
    });
  });

  describe("noAssetPaths Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/noAssetPaths");
      createMockRepository("/test/noAssetPaths", {
        assetBoxConfig: {
          "./assetbox.config.json": ` {
          "assetPaths": []
          }`,
        },
      });
    });

    test("findFilePathsFromGlob Test", async () => {
      const config = await readAssetBoxConfig();
      const result = await findFilePathsFromGlob(config.assetPaths, {
        fs: memfs,
      });

      expect(result).toStrictEqual([]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/noAssetPaths", { recursive: true });
    });
  });
});
