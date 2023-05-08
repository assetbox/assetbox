import glob, { GlobOptionsWithFileTypesUnset } from "glob";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

export const findFilePathsFromGlob = async (
  globPatterns: string[],
  options?: GlobOptionsWithFileTypesUnset
) => {
  const filePaths = await Promise.all(
    globPatterns.map((pattern: string) => {
      return glob(pattern, {
        cwd: findPackageRoot(process.cwd())!,
        nodir: true,
        ...options,
      });
    })
  );

  return filePaths
    .flat()
    .map((filePath) => resolve(findPackageRoot(process.cwd())!, filePath));
};
