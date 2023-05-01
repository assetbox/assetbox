/* File Description
 * These are Mocking directories and files for testing according to various situations.
 * ----------Case list - 2023.5.1 ----------
 * normalCase : there is no error.
 * noAssetPaths : there is no assetPaths in assetbox.config.cjs.
 * dupAssetCase : there are duplicate assets in the repository.
 * noAssetboxConfig : there is no assetbox.config.cjs.
 */

import { vol } from "memfs";

export const createNormalMockRepositry = (cwd: string) => {
  vol.fromJSON(
    {
      "./assetbox.config.cjs": `module.exports = {
          assetPaths: ["./public/**/*", "./src/assets/**/*"],
          };`,
      "./public/a.png": "1",
      "./public/b.png": "2",
      "./src/assets/c.png": "3",
      "./src/assets/d.png": "4",
      "./public/mock.md": "i am mock data",
      "./src/assets/mock.md": "i am mock data",
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

export const createNoAssetPathsMockRepositry = (cwd: string) => {
  vol.fromJSON(
    {
      "./assetbox.config.cjs": `module.exports = {
        assetPaths: [],
            };`,
      "./public/a.png": "1",
      "./public/b.png": "2",
      "./src/assets/c.png": "3",
      "./src/assets/d.png": "4",
      "./public/mock.md": "i am mock data",
      "./src/assets/mock.md": "i am mock data",
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

export const createNoAssetboxConfigMockRepositry = (cwd: string) => {
  vol.fromJSON(
    {
      "./public/a.png": "1",
      "./public/b.png": "2",
      "./src/assets/c.png": "1",
      "./src/assets/d.png": "2",
      "./public/mock.md": "i am mock data",
      "./src/assets/mock.md": "i am mock data",
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
