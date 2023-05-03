jest.mock("fs");
import { expect, jest, test } from "@jest/globals";
import memfs, { vol } from "memfs";
import process from "process";

import { findAssetFiles } from "../findAssetFiles";
import { readAssetBoxConfig } from "../readAssetBoxConfig";
import { createMockRepository } from "./utils/mockRepository";

const spy = jest.spyOn(process, "cwd");
spy.mockReturnValue("/test");

describe("fileAssetFiles Test", () => {
  describe("Normal Repository", () => {
    beforeEach(() => {
      spy.mockClear();
      spy.mockReturnValue("/test/normal");
      createMockRepository("/test/normal", { assetBoxConfig: true });
    });

    test("findAssetFiles Test", async () => {
      const config = await readAssetBoxConfig();
      const result = await findAssetFiles(config.assetPaths, {
        fs: memfs,
      });
      expect(result).toStrictEqual([
        "/test/normal/public/b.png",
        "/test/normal/public/a.png",
        "/test/normal/src/assets/d.png",
        "/test/normal/src/assets/c.png",
      ]);
    });

    afterEach(() => {
      vol.rmdirSync("/test/normal/", { recursive: true });
    });
  });

  describe("noAssetPaths Repository", () => {
    beforeEach(() => {
      spy.mockClear();
      spy.mockReturnValue("/test/noAssetPaths");
      createMockRepository("/test/noAssetPaths", {
        assetBoxConfig: {
          "./assetbox.config.json": ` {
          "assetPaths": []
          }`,
        },
      });
    });
    test("findAssetFiles Test", async () => {
      const config = await readAssetBoxConfig();

      const result = await findAssetFiles(config.assetPaths, {
        fs: memfs,
      });
      expect(result).toStrictEqual([]);
    });

    afterEach(() => {
      vol.rmdirSync("/test/noAssetPaths/", { recursive: true });
    });
  });
});
