import type { AssetBoxData, AssetStat } from "@assetbox/tools";
import { create } from "zustand";

export const useAssetBoxStore = create<AssetBoxData>((set, get) => ({
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
