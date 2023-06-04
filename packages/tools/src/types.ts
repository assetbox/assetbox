import { readAssetBoxConfig } from "./readAssetBoxConfig";

export type AssetBoxScheme = {
  categories: Record<string, string[]>;
  trackingPaths: string[];
};

export type AssetBoxConfig = Awaited<ReturnType<typeof readAssetBoxConfig>>;

export type AssetBaseStat = {
  filepath: string;
  filename: string;
  timestamp: number;
  extension: string;
  size: number;
};

export type AssetImageStat = AssetBaseStat & {
  type: "image";
};

export type AssetIconStat = AssetBaseStat & {
  type: "icon" | "animation";
  data: string;
};

export type AssetStat = AssetImageStat | AssetIconStat;

export interface AssetBoxData {
  categories: Record<string, AssetStat[]>;
  usedFiles: Record<string, string[]>;
  dupeFiles: string[][];
  uniqueCoverage: {
    count: number;
    totalCount: number;
  };
  usedCoverage: {
    count: number;
    totalCount: number;
  };
  folderTree: FolderTree;
}

export type FolderTree = {
  [path: string]: FolderTree;
};
