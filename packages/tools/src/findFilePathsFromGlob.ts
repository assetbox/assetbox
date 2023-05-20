import { glob } from "glob";
import { resolve } from "path";

import { cwd } from "./cwd";

export const findFilePathsFromGlob = async (globPatterns: string[]) => {
  const filePathSet = await Promise.all(
    globPatterns.map((pattern: string) => {
      return glob(pattern, {
        cwd: cwd(),
        nodir: true,
      });
    })
  );

  const filePaths = filePathSet
    .flat()
    .map((filePath) => resolve(cwd(), filePath));
  return [...new Set(filePaths)];
};
