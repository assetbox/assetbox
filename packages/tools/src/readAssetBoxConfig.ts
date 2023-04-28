import { lilconfig } from "lilconfig";
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
    filePath: value.filepath,
    ...value.config,
  };
};
