import type { AssetBoxData } from "@assetbox/tools";
import { create } from "zustand";

import { client } from "../api";

interface AssetBoxStore extends AssetBoxData {
  isLoaded: boolean;
}

export const useAssetBoxStore = create<AssetBoxStore>(() => ({
  base: "/",
  categories: {},
  usedFiles: {},
  dupeFiles: [],
  uniqueCoverage: {
    count: 0,
    totalCount: 0,
  },
  usedCoverage: {
    count: 0,
    totalCount: 0,
  },
  folderTree: {},
  isLoaded: false,
}));

export const syncAssetBox = async () => {
  const assetBoxData = await client.getAssetBoxData.query();

  useAssetBoxStore.setState(assetBoxData);
};
