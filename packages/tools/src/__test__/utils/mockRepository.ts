/* File Description
 * These are Mocking directories and files for testing according to various situations.
 * Only support .json config file due to the limitation of lilconfig.
 * ----------Case list - 2023.5.1 ----------
 * 1. assetbox.config.json exists
 * 2. assetbox.config.json does not exist
 * 3. assetbox.config.json exists but assetPaths is empty
 */

import { vol } from "memfs";

type MockRepositoryOptions = {
  assetBoxConfig: boolean | Record<string, string[] | string>;
  Dupe?: boolean;
};

export const createMockRepository = (
  cwd: string,
  options: MockRepositoryOptions
) => {
  vol.fromJSON(
    {
      ...(options.assetBoxConfig === true && {
        "./assetbox.config.json": `{"assetPaths": ["./public/**/*", "./src/assets/**/*"],"trackingPaths": ["./src/**/*.*"]}`,
      }),
      ...(typeof options.assetBoxConfig === "object" && options.assetBoxConfig),

      ...(options.Dupe && {
        "./public/a_copy.png": "1",
        "./src/assets/a.png": "1",
        "./public/b_copy.png": "2",
      }),
      "./public/a.png": "1",
      "./public/b.png": "2",
      "./src/assets/c.png": "3",
      "./src/assets/d.png": "4",
      "./public/mock.md": "i am mock data",
      "./src/assets/mock.md": "i am mock data2",
      "./package.json": `
      {
        "name": "test",
        "version": "1.0.0",
      }`,
      "./pnpm-lock.yaml": ``,
    },
    cwd
  );
};
