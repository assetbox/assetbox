import glob from "glob";

import { ASSET_EXTENSIONS } from "./common/const";
import { readAssetBoxConfig } from "./readAssetBoxConfig";

export const findAssetPaths = async () => {
  const { assetPaths } = await readAssetBoxConfig();

  const fileList = await Promise.all(
    assetPaths.map((assetPath: string) => glob(assetPath))
  );
  return fileList.flat().filter((file) => {
    const fileExtension = file.split(".").pop()?.toLowerCase();
    return fileExtension && ASSET_EXTENSIONS.includes(fileExtension);
  });
};
