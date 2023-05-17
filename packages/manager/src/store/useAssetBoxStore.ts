import { create } from "zustand";

import type { AssetBoxData, AssetStat } from "../types";

export const useAssetBoxStore = create<AssetBoxData>((set, get) => ({
  ...(typeof window !== "undefined" ? window.__ASSET_DATA__ : {}),
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
