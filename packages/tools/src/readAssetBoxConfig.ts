import { lilconfig } from "lilconfig";
import { findPackageRoot } from "workspace-tools";

import { findFilePathsFromGlob } from "./findFilePathsFromGlob";
import type { AssetBoxScheme } from "./types";

export const getCategoryFileList = async (
  category: AssetBoxScheme["categories"]
) => {
  const globEntries = await Promise.all(
    Object.entries(category).map(async ([categoryName, glob]) => {
      const filePaths = await findFilePathsFromGlob(glob);

      return [categoryName, filePaths] satisfies [string, string[]];
    })
  );

  return globEntries.reduce<Record<string, string[]>>(
    (acc, [categoryName, filePaths]) => {
      acc[categoryName] = filePaths;
      return acc;
    },
    {}
  );
};

export const readAssetBoxConfig = async () => {
  const options = {
    stopDir: findPackageRoot(process.cwd()),
    searchPlaces: [
      "assetbox.config.js",
      "assetbox.config.cjs",
      "assetbox.config.json",
    ],
    ignoreEmptySearchPlaces: false,
  };

  const value = await lilconfig("assetBox", options).search();
  if (!value || value.isEmpty) {
    throw new Error("Couldn't find assetbox.config.js.");
  }

  const { categories, trackingPaths }: AssetBoxScheme = value.config;

  return {
    configFilePath: value.filepath,
    trackingFiles: await findFilePathsFromGlob(trackingPaths),
    categories: await getCategoryFileList(categories),
  };
};
