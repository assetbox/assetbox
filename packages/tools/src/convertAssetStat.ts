import fs from "fs/promises";
import { relative } from "path";
import { findPackageRoot } from "workspace-tools";

export const convertAssetStat = async (assetFile: string) => {
  const extension = assetFile.split(".").pop();
  if (!extension) {
    throw new Error(`Unknown extension from 'assetFile'`);
  }

  const { size, birthtimeMs } = await fs.stat(assetFile);

  let data: string | null = null;

  if (["svg", "json"].includes(extension)) {
    data = await fs.readFile(assetFile, "utf-8");
  }

  return {
    filename: relative(findPackageRoot(process.cwd())!, assetFile),
    timestamp: birthtimeMs,
    type: extension === "svg" ? "icon" : "image",
    data,
    extension,
    size,
  };
};
