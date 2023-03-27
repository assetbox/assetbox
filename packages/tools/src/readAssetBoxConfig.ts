import { lilconfig } from "lilconfig";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

import type { AssetBoxConfig } from "./types";

export const readAssetBoxConfig = async (): Promise<AssetBoxConfig> => {
  const options = {
    stopDir: findPackageRoot(process.cwd()),
    searchPlaces: ["assetbox.config.js", "assetbox.config.cjs"],
    ignoreEmptySearchPlaces: false,
  };

  const value = await lilconfig("assetBox", options).search();
  if (!value) {
    throw new Error("Couldn't find assetbox.config.js.");
  }
  return {
    filePaths: [resolve(options.stopDir!, value.config.assetPaths[0])],
    ...value.config,
  };
};
