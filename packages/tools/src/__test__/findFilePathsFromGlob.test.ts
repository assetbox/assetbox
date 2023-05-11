jest.mock("fs");

import { expect, jest, test } from "@jest/globals";
import { vol } from "memfs";
import process from "process";

import { findFilePathsFromGlob } from "../findFilePathsFromGlob";
import { createMockRepository } from "./utils/mockRepository";

const spy = jest.spyOn(process, "cwd");

describe("findFilePathsFromGlob Test", () => {
  describe("Normal Repository", () => {
    beforeAll(() => {
      spy.mockReturnValue("/test/normal");
      createMockRepository("/test/normal", { assetBoxConfig: true });
    });

    test("findFilePathsFromGlob Test", async () => {
      const result = await findFilePathsFromGlob([
        "./public/**/*",
        "./src/assets/**/*",
      ]);

      expect(result).toStrictEqual([
        "/test/normal/public/b.png",
        "/test/normal/public/a.png",
        "/test/normal/src/assets/icons/d.svg",
        "/test/normal/src/assets/icons/c.svg",
      ]);
    });

    test("findFilePathsFromGlob Test", async () => {
      const result = await findFilePathsFromGlob([]);

      expect(result).toStrictEqual([]);
    });

    afterAll(() => {
      spy.mockClear();
      vol.rmdirSync("/test/normal", { recursive: true });
    });
  });
});
