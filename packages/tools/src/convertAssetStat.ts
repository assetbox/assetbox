import fs from "fs/promises";
import { relative } from "path";
import { sep } from "path";

import { EXTENSIONS } from "./common/const";
import { cwd } from "./cwd";
import { AssetStat } from "./types";

export const convertAssetStat = async (assetFile: string) => {
  const extension = assetFile.split(".").pop();
  if (!extension || !EXTENSIONS.all().includes(extension)) {
    throw new Error(`Not Support extension from 'assetFile'`);
  }

  const { size, birthtimeMs } = await fs.stat(assetFile);

  const baseStat = {
    filepath: relative(cwd(), assetFile),
    filename: assetFile.split(sep).pop()!,
    timestamp: birthtimeMs,
    extension,
    size,
  };

  if (EXTENSIONS.image.includes(extension)) {
    return {
      ...baseStat,
      type: "image",
    } satisfies AssetStat;
  }

  const data = await fs.readFile(assetFile, "utf-8");

  return {
    ...baseStat,
    type: EXTENSIONS.icon.includes(extension) ? "icon" : "animation",
    data,
  } satisfies AssetStat;
};
