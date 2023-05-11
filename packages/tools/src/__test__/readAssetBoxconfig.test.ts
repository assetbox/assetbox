jest.mock("fs");
jest.mock("fs/promises");

import { vol } from "memfs";
import process from "process";

import { readAssetBoxConfig } from "../readAssetBoxConfig";
import { createMockRepository } from "./utils/mockRepository";
const spy = jest.spyOn(process, "cwd");

describe("readAssetBoxConfig Test", () => {
  describe("Normal Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/normal");
      createMockRepository("/test/normal", { assetBoxConfig: true });
    });

    test("readAssetBox config", async () => {
      const config = await readAssetBoxConfig();
      expect(config).toStrictEqual({
        assetPaths: ["./public/**/*", "./src/assets/**/*"],
        configFilePath: "/test/normal/assetbox.config.json",
        trackingPaths: ["./src/**/*.*"],
      });
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/normal/", { recursive: true });
    });
  });

  describe("emptyConfig Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/noAssetPaths");
      createMockRepository("/test/noAssetPaths", {
        assetBoxConfig: {
          "./assetbox.config.json": ` {
            "assetPaths": [],
            "trackingPaths": []
            }`,
        },
      });
    });

    test("readAssetBox config", async () => {
      const config = await readAssetBoxConfig();
      expect(config).toStrictEqual({
        assetPaths: [],
        configFilePath: "/test/noAssetPaths/assetbox.config.json",
        trackingPaths: [],
      });
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/noAssetPaths/", { recursive: true });
    });
  });

  describe("noAssetboxConfig Repository", () => {
    beforeEach(() => {
      spy.mockReturnValue("/test/noAssetboxConfig");
      createMockRepository("/test/noAssetboxConfig", { assetBoxConfig: false });
    });

    test("readAssetBox config", async () => {
      try {
        await readAssetBoxConfig();
      } catch (e) {
        if (e instanceof Error) {
          expect(e.message).toBe("Couldn't find assetbox.config.js.");
        }
      }
    });

    afterEach(() => {
      spy.mockClear();
      vol.rmdirSync("/test/noAssetboxConfig", { recursive: true });
    });
  });
});
