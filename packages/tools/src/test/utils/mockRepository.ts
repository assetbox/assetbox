/* File Description
 * These are Mocking directories and files for testing according to various situations.
 * Only support .json config file due to the limitation of lilconfig.
 * ----------Case list - 2023.5.1 ----------
 * 1. assetbox.config.json exists
 * 2. assetbox.config.json does not exist
 * 3. assetbox.config.json exists but assetPaths is empty
 */

import { vol } from "memfs";
import detent from "ts-dedent";

type MockRepositoryOptions = {
  assetBoxConfig: boolean | "empty" | Record<string, string[] | string>;
  isDupe?: boolean;
};

export const createMockRepository = (
  cwd: string,
  options: MockRepositoryOptions
) => {
  vol.fromJSON(
    {
      ...(options.assetBoxConfig === true && {
        "./assetbox.config.json": detent`
        {
          "categories": {
            "Icons": ["./src/assets/icons/**/*"],
            "Images": ["./public/**/*"]
          },
          "trackingPaths": ["./src/**/*"]
        }
        `,
      }),
      ...(options.assetBoxConfig === "empty" && {
        "./assetbox.config.json": detent`
        {
          "categories": {},
          "trackingPaths": []
        }
        `,
      }),
      ...(typeof options.assetBoxConfig === "object" && options.assetBoxConfig),
      ...(options.isDupe && {
        "./public/a_copy.png": "1",
        "./public/b_copy.png": "2",
        "./src/assets/a.png": "1",
      }),
      "./public/a.png": "1",
      "./public/b.png": "2",
      "./src/assets/icons/c.svg": "3",
      "./src/assets/icons/d.svg": "4",
      "./package.json": detent`
      {
        "name": "test",
      }`,
      "./pnpm-lock.yaml": ``,
    },
    cwd
  );
};
