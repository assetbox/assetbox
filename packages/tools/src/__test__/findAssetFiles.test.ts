jest.mock("fs");
import { expect, jest, test } from "@jest/globals";
import memfs, { vol } from "memfs";
import process from "process";

import { findAssetFiles } from "../findAssetFiles";
import { readAssetBoxConfig } from "../readAssetBoxConfig";
import {
  createNoAssetboxConfigMockRepositry,
  createNoAssetPathsMockRepositry,
  createNormalMockRepositry,
} from "./utils/mockRepository";
const spy = jest.spyOn(process, "cwd");
spy.mockReturnValue("/test");

describe("Normal repository", () => {
  beforeEach(() => {
    spy.mockClear();
    spy.mockReturnValue("/test/normal");
    createNormalMockRepositry("/test/normal");
  });
  test(`Is the Mock Repository well made?`, () => {
    expect(vol.existsSync("/test/normal")).toBe(true);
  });

  test("Testing fileAssetFiles.ts", async () => {
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
});
