import fs from "fs/promises";
import glob from "glob";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

import { ASSET_EXTENSIONS } from "./common/const";

export const findAssetPaths = async () => {
  const configPath = resolve(
    findPackageRoot(process.cwd())!,
    "assetbox.config.json"
  );
  const data = await fs.readFile(configPath);
  const json = JSON.parse(data.toString());

  const fileList = await Promise.all(
    json.assetPaths.map((assetPath: string) => glob(assetPath))
  );
  return fileList.flat().filter((file) => {
    const fileExtension = file.split(".").pop().toLowerCase();
    return ASSET_EXTENSIONS.includes(fileExtension);
  });
};
