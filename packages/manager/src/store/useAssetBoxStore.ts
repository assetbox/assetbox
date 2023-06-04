import type { AssetBoxData, AssetStat } from "@assetbox/tools";
import { create } from "zustand";

import { client } from "../api";

interface AssetBoxStore extends AssetBoxData {
  isLoaded: boolean;
  appendCategories: (categoryName: string, category: AssetStat) => void;
}

export const useAssetBoxStore = create<AssetBoxStore>((set, get) => ({
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
  appendCategories: (categoryName: string, category: AssetStat) => {
    const { categories } = get();

    set({
      categories: {
        ...categories,
        [categoryName]: [...categories[categoryName], category],
      },
    });
  },
}));

export const syncAssetBox = async () => {
  const assetBoxData = await client.getAssetBoxData.query();

  useAssetBoxStore.setState(assetBoxData);
};
