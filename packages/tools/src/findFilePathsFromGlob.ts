import glob from "glob";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

export const findFilePathsFromGlob = async (globPatterns: string[]) => {
  const filePaths = await Promise.all(
    globPatterns.map((pattern: string) => glob(pattern))
  );

  return filePaths
    .flat()
    .map((filePath) => resolve(findPackageRoot(process.cwd())!, filePath));
};
