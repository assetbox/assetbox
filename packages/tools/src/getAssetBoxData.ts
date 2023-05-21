import { findDupeFileSet } from "./findDupeFileSet";
import { getCategoryStats } from "./getCategoryStats";
import { findImportFileSet } from "./importExtract";
import { readAssetBoxConfig } from "./readAssetBoxConfig";
import { AssetBoxData } from "./types";

export const getAssetBoxData = async () => {
  const { categories, trackingPaths } = await readAssetBoxConfig();

  const categoryStats = await getCategoryStats(categories);

  const assetFiles = Object.values(categories).flat();
  const dupeFiles = await findDupeFileSet(assetFiles);
  const usedFiles = await findImportFileSet(assetFiles, trackingPaths);

  const usedCount = Object.values(usedFiles).reduce(
    (acc, files) => (files.length > 0 ? acc + 1 : acc),
    0
  );

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
  } satisfies AssetBoxData;
};
