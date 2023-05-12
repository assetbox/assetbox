import { allSettled } from "./allSettled";
import { convertAssetStat } from "./convertAssetStat";
import { AssetStat } from "./types";

export const getCategoryStats = async (
  categories: Record<string, string[]>
) => {
  const categoryStats = await Promise.all(
    Object.entries(categories).map(async ([key, files]) => {
      const { fulfilled } = await allSettled(files.map(convertAssetStat));

      return [key, fulfilled] satisfies [string, AssetStat[]];
    })
  );

  return categoryStats.reduce((acc, [key, files]) => {
    acc[key] = files;
    return acc;
  }, {} as Record<string, AssetStat[]>);
};
