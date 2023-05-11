import { glob } from "glob";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

export const findFilePathsFromGlob = async (globPatterns: string[]) => {
  const filePathSet = await Promise.all(
    globPatterns.map((pattern: string) => {
      return glob(pattern, {
        cwd: findPackageRoot(process.cwd())!,
        nodir: true,
      });
    })
  );

  const filePaths = filePathSet
    .flat()
    .map((filePath) => resolve(findPackageRoot(process.cwd())!, filePath));
  return [...new Set(filePaths)];
};
