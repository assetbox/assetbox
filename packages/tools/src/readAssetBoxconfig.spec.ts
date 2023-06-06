jest.mock("fs");
jest.mock("fs/promises");

import { vol } from "memfs";
import process from "process";

import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./test/utils/mockRepository";
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
        categories: {
          Icons: [
            "/test/normal/src/assets/icons/d.svg",
            "/test/normal/src/assets/icons/c.svg",
          ],
          Images: ["/test/normal/public/b.png", "/test/normal/public/a.png"],
        },
        iconBuild: {
          outdir: "dist",
          plugins: [],
        },
        configFilePath: "/test/normal/assetbox.config.json",
        trackingPaths: [
          "/test/normal/src/assets/icons/d.svg",
          "/test/normal/src/assets/icons/c.svg",
        ],
      });
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/normal/", { recursive: true });
    });
  });

  describe("emptyConfig Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/emptyConfig");
      createMockRepository("/test/emptyConfig", {
        assetBoxConfig: "empty",
      });
    });

    test("readAssetBox config", async () => {
      const config = await readAssetBoxConfig();
      expect(config).toStrictEqual({
        categories: {},
        iconBuild: {
          outdir: "dist",
          plugins: [],
        },
        configFilePath: "/test/emptyConfig/assetbox.config.json",
        trackingPaths: [],
      });
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/emptyConfig", { recursive: true });
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
