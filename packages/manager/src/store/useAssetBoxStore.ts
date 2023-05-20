import type { AssetBoxData, AssetStat } from "@assetbox/tools";
import { create } from "zustand";

interface AssetBoxStore extends AssetBoxData {
  isLoaded: boolean;
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
