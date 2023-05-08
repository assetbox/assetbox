jest.mock("fs");
jest.mock("fs/promises");
import { vol } from "memfs";
import process from "process";

import { findDupeFileSet } from "../findDupeFileSet";
import { findFilePathsFromGlob } from "../findFilePathsFromGlob";
import { mergeDupeFileSet } from "../mergeDupeFileSet";
import { readAssetBoxConfig } from "../readAssetBoxConfig";
import { createMockRepository } from "./utils/mockRepository";
const spy = jest.spyOn(process, "cwd");

describe("mergeDupeFileSet Test", () => {
  beforeAll(() => {
    spy.mockReturnValue("/test/dupe");
    createMockRepository("/test/dupe", {
      assetBoxConfig: true,
      isDupe: false,
    });
  });

  test("Dupe Repository", async () => {
    const config = await readAssetBoxConfig();
    const assetFiles = await findFilePathsFromGlob(config.assetPaths, {
      fs: memfs,
    });
    const dupeFileSetFromAssetFiles = await findDupeFileSet(assetFiles);
    const mergedDupFileSet = await mergeDupeFileSet(dupeFileSetFromAssetFiles);

    expect(mergedDupFileSet).toStrictEqual([
      ["/test/dupe/public/b_copy_merged.png"],
      ["/test/basic/public/a_copy_merged.png"],
    ]);
  });

  afterAll(() => {
    spy.mockClear();
    vol.rmdirSync("/test/dupe/", { recursive: true });
  });
});
