import { after, afterEach, beforeEach } from "node:test";

import { vol } from "memfs";

import { createMockRepository } from "./utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("Creating Mock Repository", () => {
  describe("Normal Repository", () => {
    beforeEach(() => {
      spy.mockReturnValue("/test/normal");
    });

    test("Normal Repository", () => {
      createMockRepository("/test/normal", { assetBoxConfig: true });

      expect(vol.existsSync("/test/normal")).toBe(true);
      expect(vol.readdirSync("/test/normal")).toStrictEqual([
        "assetbox.config.json",
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "src",
      ]);
    });

    afterEach(() => {
      spy.mockClear();
    });
  });
  describe("No AssetPaths Repository", () => {
    beforeEach(() => {
      spy.mockReturnValue("/test/noAssetPaths");
    });

    test("No AssetPaths Repository", () => {
      spy.mockClear();
      spy.mockReturnValue("/test/noAssetPaths");
      createMockRepository("/test/noAssetPaths", {
        assetBoxConfig: {
          "./assetbox.config.json": ` {
          "assetPaths": []
          }`,
        },
      });
      expect(vol.existsSync("/test/noAssetPaths")).toBe(true);
      expect(vol.readdirSync("/test/noAssetPaths")).toStrictEqual([
        "assetbox.config.json",
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "src",
      ]);
    });

    afterEach(() => {
      spy.mockClear();
    });
  });

  describe("No AssetboxConfig Repository", () => {
    beforeEach(() => {
      spy.mockReturnValue("/test/noAssetPaths");
    });

    test("No AssetboxConfig Repository", () => {
      spy.mockClear();
      spy.mockReturnValue("/test/noAssetboxConfig");
      createMockRepository("/test/noAssetboxConfig", { assetBoxConfig: false });
      expect(vol.existsSync("/test/noAssetboxConfig")).toBe(true);
      expect(vol.readdirSync("/test/noAssetboxConfig")).toStrictEqual([
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "src",
      ]);
    });

    afterEach(() => {
      spy.mockClear();
    });
  });
});
