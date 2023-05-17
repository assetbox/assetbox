// TODO: not yet scheme

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
  type: "icon";
  data: string;
};

export type AssetStat = AssetImageStat | AssetIconStat;

export interface AssetBoxData {
  categories: Record<string, AssetStat[]>;
  dupeFiles: string[][];
}
