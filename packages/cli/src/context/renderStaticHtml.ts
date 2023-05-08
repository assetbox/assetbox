import {
  allSettled,
  convertAssetStat,
  findDupeFileSet,
  findFilePathsFromGlob,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { resolveCliRoot } from "src/utils/path";

export const getAssetBoxData = async () => {
  const { assetPaths } = await readAssetBoxConfig();

  const assetFiles = await findFilePathsFromGlob(assetPaths);
  const dupeFiles = await findDupeFileSet(assetFiles);

  const assetFileStats = await allSettled(assetFiles.map(convertAssetStat));

  return {
    assetFiles: assetFileStats.fulfilled,
    dupeFiles,
  };
};

export const renderStaticHtml = async (template: string, url: string) => {
  const entryServerModulePath = resolveCliRoot("ssr", "entryServer.cjs");

  const ssrData = await getAssetBoxData();

  const { render } = await import(entryServerModulePath);
  const appHtml = await render(url, ssrData);

  return template
    .replace("<!--ssr-outlet-->", appHtml)
    .replace("<!--data-outlet-->", JSON.stringify(ssrData));
};
