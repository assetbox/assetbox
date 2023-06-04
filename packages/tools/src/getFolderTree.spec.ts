jest.mock("fs");
jest.mock("fs/promises");
import { expect, jest } from "@jest/globals";
import { vol } from "memfs";
import process from "process";

import { getFolderTree } from "./getFolderTree";
import { createMockRepository } from "./test/utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("getFolderTree Test", () => {
  beforeAll(async () => {
    spy.mockReturnValue("/test/basic");
    createMockRepository("/test/basic", {
      assetBoxConfig: true,
    });
  });

  it("should  Test", async () => {
    const folderTree = await getFolderTree();

    expect(folderTree).toStrictEqual({
      public: {},
      src: {
        assets: {
          icons: {},
        },
      },
    });
  });

  afterAll(() => {
    spy.mockClear();
    vol.rmdirSync("/test/basic", { recursive: true });
  });
});
