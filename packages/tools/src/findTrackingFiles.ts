import glob from "glob";
import { resolve } from "path";
import { findPackageRoot } from "workspace-tools";

import { TRACKING_EXTENSIONS } from "./common/const";

export const findTrackingFiles = async (trackingPaths: string[]) => {
  const files = await Promise.all(
    trackingPaths.map((trackingPath: string) => glob(trackingPath))
  );

  return files
    .flat()
    .map((file) => resolve(findPackageRoot(process.cwd())!, file))
    .filter((file) => {
      const fileExtension = file.split(".").pop()?.toLowerCase();
      return fileExtension && TRACKING_EXTENSIONS.includes(fileExtension);
    });
};
