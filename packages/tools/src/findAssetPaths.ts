import glob from "glob";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

import { ASSET_EXTENSIONS } from "./common/const";

export const findAssetPaths = async (assetPaths: string[]) => {
  const files = await Promise.all(
    assetPaths.map((assetPath: string) => glob(assetPath))
  );

  return files
    .flat()
    .map((file) => resolve(findPackageRoot(process.cwd())!, file))
    .filter((file) => {
      const fileExtension = file.split(".").pop()?.toLowerCase();
      return fileExtension && ASSET_EXTENSIONS.includes(fileExtension);
    });
};
