import glob from "glob";

import { ASSET_EXTENSIONS } from "./common/const";

export const findAssetFiles = async (assetPaths: string[]) => {
  const files = await Promise.all(
    assetPaths.map((assetPath: string) => glob(assetPath))
  );

  return files.flat().filter((file) => {
    const fileExtension = file.split(".").pop()?.toLowerCase();
    return fileExtension && ASSET_EXTENSIONS.includes(fileExtension);
  });
};
