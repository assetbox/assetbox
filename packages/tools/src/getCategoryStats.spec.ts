jest.mock("fs");
jest.mock("fs/promises");
import { expect, jest } from "@jest/globals";
import { vol } from "memfs";
import process from "process";

import { getCategoryStats } from "./getCategoryStats";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { createMockRepository } from "./test/utils/mockRepository";
import { AssetBoxConfig } from "./types";

const spy = jest.spyOn(process, "cwd");

describe("getCategoryStats Test", () => {
  let assetBoxConfig: AssetBoxConfig;

  beforeAll(async () => {
    spy.mockReturnValue("/test/basic");
    createMockRepository("/test/basic", {
      assetBoxConfig: true,
    });

    assetBoxConfig = await readAssetBoxConfig();
  });

  it("should  Test", async () => {
    const categories = await getCategoryStats(assetBoxConfig.categories);

    expect(categories.Icons[0].filepath).toBe("src/assets/icons/d.svg");
    expect(categories.Icons[0].filename).toBe("d.svg");
    expect(categories.Icons[0].type).toBe("icon");
    expect(categories.Icons[0].data).toBe("4");
    expect(categories.Icons[1].filepath).toBe("src/assets/icons/c.svg");
    expect(categories.Icons[1].filename).toBe("c.svg");
    expect(categories.Icons[1].type).toBe("icon");
    expect(categories.Icons[1].data).toBe("3");

    expect(categories.Images[0].filepath).toBe("public/b.png");
    expect(categories.Images[0].filename).toBe("b.png");
    expect(categories.Images[0].type).toBe("image");
    expect(categories.Images[0].data).toBe(null);
    expect(categories.Images[1].filepath).toBe("public/a.png");
    expect(categories.Images[1].filename).toBe("a.png");
    expect(categories.Images[1].type).toBe("image");
    expect(categories.Images[1].data).toBe(null);
  });

  afterAll(() => {
    spy.mockClear();
    vol.rmdirSync("/test/basic", { recursive: true });
  });
});
