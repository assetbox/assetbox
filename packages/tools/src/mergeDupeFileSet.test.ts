jest.mock("fs");
jest.mock("fs/promises");

import memfs, { vol } from "memfs";
import process from "process";

import { findDupeFileSet } from "./findDupeFileSet";
import { findFilePathsFromGlob } from "./findFilePathsFromGlob";
import { mergeDupeFileSet } from "./mergeDupeFileSet";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./testUtils/mockRepository";
const spy = jest.spyOn(process, "cwd");

describe("mergeDupeFileSet Test", () => {
  beforeAll(() => {
    spy.mockReturnValue("/test/dupe");
    createMockRepository("/test/dupe", {
      assetBoxConfig: true,
      isDupe: true,
    });
  });

  test("Dupe Repository", async () => {
    const config = await readAssetBoxConfig();

    const assetFiles = await findFilePathsFromGlob(config.assetPaths, {
      fs: memfs,
    });

    const dupeFileSetFromAssetFiles = await findDupeFileSet(assetFiles);

    const mergedDupFileSet = await mergeDupeFileSet(
      dupeFileSetFromAssetFiles[0],
      "/test/dupe/public/merged"
    );

    expect(mergedDupFileSet).toEqual({
      isMerged: true,
      newPathAndName: "/test/dupe/public/merged.png",
    });

    expect(vol.readdirSync("/test/dupe/public")).toStrictEqual([
      "a.png",
      "a_copy.png",
      "merged.png",
      "mock.md",
    ]);

    expect(vol.readdirSync("/test/dupe/src/assets")).toStrictEqual([
      "a.png",
      "c.png",
      "d.png",
      "mock.md",
    ]);
  });

  afterAll(() => {
    spy.mockClear();
    vol.rmdirSync("/test/dupe/", { recursive: true });
  });
});
