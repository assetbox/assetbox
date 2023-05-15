import { convertAssetStat } from "./convertAssetStat";
import { readAssetBoxConfig } from "./readAssetBoxConfig";

export type AssetBoxScheme = {
  categories: Record<string, string[]>;
  trackingPaths: string[];
};

export type AssetStat = Awaited<ReturnType<typeof convertAssetStat>>;
export type AssetBoxConfig = Awaited<ReturnType<typeof readAssetBoxConfig>>;
