import { findDupeFileSet } from "./findDupeFileSet";
import { getCategoryStats } from "./getCategoryStats";
import { getFolderTree } from "./getFolderTree";
import { findImportFileSet } from "./importExtract";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { AssetBoxData } from "./types";

type GetAssetBoxOptions = {
  onlyCategories: boolean;
};

export const getAssetBoxData = async (options?: GetAssetBoxOptions) => {
  const { categories, trackingPaths } = await readAssetBoxConfig();

  const categoryStats = await getCategoryStats(categories);

  const assetFiles = Object.values(categories).flat();
  const dupeFiles = await findDupeFileSet(assetFiles);
  const usedFiles = await findImportFileSet(assetFiles, trackingPaths);

  const usedCount = Object.values(usedFiles).reduce(
    (acc, files) => (files.length > 0 ? acc + 1 : acc),
    0
  );

  const folderTree = await getFolderTree();

  if (options?.onlyCategories) {
    return {
      categories: categoryStats,
      usedFiles: {},
      usedCoverage: {
        count: 0,
        totalCount: 0,
      },
      dupeFiles: [],
      uniqueCoverage: {
        count: 0,
        totalCount: 0,
      },
      folderTree: {},
    } satisfies AssetBoxData;
  }

  return {
    categories: categoryStats,
    usedFiles,
    usedCoverage: {
      count: usedCount,
      totalCount: assetFiles.length,
    },
    dupeFiles,
    uniqueCoverage: {
      count: assetFiles.length - dupeFiles.flat().length,
      totalCount: assetFiles.length,
    },
    folderTree,
  } satisfies AssetBoxData;
};
