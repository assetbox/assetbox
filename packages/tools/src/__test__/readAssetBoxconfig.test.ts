jest.mock("fs");
import memfs, { vol } from "memfs";
import process from "process";

import { readAssetBoxConfig } from "../readAssetBoxConfig";
import {
  createNoAssetboxConfigMockRepositry,
  createNoAssetPathsMockRepositry,
  createNormalMockRepositry,
} from "./utils/mockRepository";
const spy = jest.spyOn(process, "cwd");
spy.mockReturnValue("/test");

describe("readAssetBoxConfig Test", () => {
  describe("Normal Repository", () => {
    beforeEach(() => {
      spy.mockClear();
      spy.mockReturnValue("/test/normal");
      createNormalMockRepositry("/test/normal");
    });
    test("readAssetBox config", async () => {
      const config = await readAssetBoxConfig();
      expect(config).toStrictEqual({
        assetPaths: ["./public/**/*", "./src/assets/**/*"],
        filePath: "/test/normal/assetbox.config.cjs",
      });
    });
    afterEach(() => {
      vol.rmdirSync("/test/normal/", { recursive: true });
    });
  });

  describe("noAssetPaths Repository", () => {
    beforeEach(() => {
      spy.mockClear();
      spy.mockReturnValue("/test/noAssetPaths");
      createNoAssetPathsMockRepositry("/test/noAssetPaths");
    });
    test("readAssetBox config", async () => {
      const config = await readAssetBoxConfig();
      expect(config).toStrictEqual({
        assetPaths: ["./public/**/*", "./src/assets/**/*"],
        filePath: "/test/noAssetPaths/assetbox.config.cjs",
      });
    });
    afterEach(() => {
      vol.rmdirSync("/test/noAssetPaths/", { recursive: true });
    });
  });

  describe("noAssetboxConfig Repository", () => {
    beforeEach(() => {
      spy.mockClear();
      spy.mockReturnValue("/test/noAssetboxConfig");
      createNoAssetboxConfigMockRepositry("/test/noAssetboxConfig");
    });
    test("readAssetBox config", async () => {
      try {
        const config = await readAssetBoxConfig();
      } catch (e) {
        expect(e.message).toBe("Couldn't find assetbox.config.js.");
      }
    });
  });
});
