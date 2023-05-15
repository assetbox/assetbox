import { vol } from "memfs";

import { createMockRepository } from "./test/utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("Creating Mock Repository", () => {
  describe("Normal Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/normal");
      createMockRepository("/test/normal", { assetBoxConfig: true });
    });

    test("Normal Repository", () => {
      expect(vol.existsSync("/test/normal")).toBe(true);
      expect(vol.readdirSync("/test/normal")).toStrictEqual([
        "assetbox.config.json",
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "src",
      ]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/normal", { recursive: true });
    });
  });

  describe("No Categories Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/noCategories");
      createMockRepository("/test/noCategories", {
        assetBoxConfig: "empty",
      });
    });

    test("No Categories Repository", () => {
      expect(vol.existsSync("/test/noCategories")).toBe(true);
      expect(vol.readdirSync("/test/noCategories")).toStrictEqual([
        "assetbox.config.json",
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "src",
      ]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/noCategories", { recursive: true });
    });
  });

  describe("No AssetboxConfig Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/noAssetboxConfig");
      createMockRepository("/test/noAssetboxConfig", { assetBoxConfig: false });
    });

    test("No AssetboxConfig Repository", () => {
      expect(vol.existsSync("/test/noAssetboxConfig")).toBe(true);
      expect(vol.readdirSync("/test/noAssetboxConfig")).toStrictEqual([
        "package.json",
        "pnpm-lock.yaml",
        "public",
        "src",
      ]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/noAssetboxConfig", { recursive: true });
    });
  });
});
