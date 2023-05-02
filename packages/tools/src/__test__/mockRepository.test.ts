import { vol } from "memfs";

import {
  createNoAssetboxConfigMockRepositry,
  createNoAssetPathsMockRepositry,
  createNormalMockRepositry,
} from "./utils/mockRepository";

const spy = jest.spyOn(process, "cwd");
spy.mockReturnValue("/test/normal");

describe("Creating Mock Repository", () => {
  test("Normal Repository", () => {
    createNormalMockRepositry("/test/normal");
    expect(vol.existsSync("/test/normal")).toBe(true);
    expect(vol.readdirSync("/test/normal")).toStrictEqual([
      "assetbox.config.cjs",
      "package.json",
      "pnpm-lock.yaml",
      "public",
      "src",
    ]);
  });
  test("No AssetPaths Repository", () => {
    spy.mockClear();
    spy.mockReturnValue("/test/noAssetPaths");
    createNoAssetPathsMockRepositry("/test/noAssetPaths");
    expect(vol.existsSync("/test/noAssetPaths")).toBe(true);
    expect(vol.readdirSync("/test/noAssetPaths")).toStrictEqual([
      "assetbox.config.cjs",
      "package.json",
      "pnpm-lock.yaml",
      "public",
      "src",
    ]);
  });
  test("No AssetboxConfig Repository", () => {
    spy.mockClear();
    spy.mockReturnValue("/test/noAssetboxConfig");
    createNoAssetboxConfigMockRepositry("/test/noAssetboxConfig");
    expect(vol.existsSync("/test/noAssetboxConfig")).toBe(true);
    expect(vol.readdirSync("/test/noAssetboxConfig")).toStrictEqual([
      "package.json",
      "pnpm-lock.yaml",
      "public",
      "src",
    ]);
  });
});
