import type { AssetStat } from "@assetbox/tools";

export const compareByName =
  (ascending: "ASC" | "DESC") => (a: AssetStat, b: AssetStat) => {
    if (ascending === "ASC") {
      return a.filename.localeCompare(b.filename);
    } else {
      return b.filename.localeCompare(a.filename);
    }
  };
