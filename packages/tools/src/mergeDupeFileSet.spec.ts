jest.mock("fs");
jest.mock("fs/promises");

import { vol } from "memfs";
import process from "process";

import { findDupeFileSet } from "./findDupeFileSet";
import { mergeDupeFileSet } from "./mergeDupeFileSet";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./test/utils/mockRepository";
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
    const { categories } = await readAssetBoxConfig();
    const assetFiles = Object.values(categories).flat();

    const [dupeFileSetFromAssetFiles] = await findDupeFileSet(assetFiles);

    const mergedDupeFileSet = await mergeDupeFileSet(
      dupeFileSetFromAssetFiles,
      "/test/dupe/public/merged.png"
    );

    expect(mergedDupeFileSet).toEqual({
      isMerged: true,
    });

    expect(vol.readdirSync("/test/dupe/public")).toStrictEqual([
      "a.png",
      "a_copy.png",
      "merged.png",
    ]);
  });

  afterAll(() => {
    spy.mockClear();
    vol.rmdirSync("/test/dupe", { recursive: true });
  });
});
