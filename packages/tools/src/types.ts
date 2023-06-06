import type { ExtractImport } from "./importExtract";

export type IconBuildPlugin = {
  name: string;
  build: (context: AssetBoxConfig) => void | Promise<void>;
};

export type AssetBoxScheme = {
  categories: Record<string, string[]>;
  trackingPaths: string[];
  staticBuild?: {
    outDir?: string;
  };
  iconBuild?: {
    outDir?: string;
    plugins?: IconBuildPlugin[];
  };
  port?: number;
};

export type AssetBoxConfig = {
  configFilePath: string;
} & AssetBoxScheme;

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
  usedFiles: Record<string, ExtractImport[]>;
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
