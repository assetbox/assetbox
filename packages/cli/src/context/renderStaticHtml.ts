import {
  allSettled,
  convertAssetStat,
  findDupeFileSet,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { resolveCliRoot } from "src/utils/path";

export const getAssetBoxData = async () => {
  const { categories } = await readAssetBoxConfig();
  const assetFiles = Object.values(categories).flat();
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
