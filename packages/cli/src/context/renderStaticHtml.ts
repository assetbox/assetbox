import {
  findAssetFiles,
  findDupeFileSet,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { resolveCliRoot } from "src/utils/path";

export const getAssetBoxData = async () => {
  const { assetPaths } = await readAssetBoxConfig();

  const assetFiles = await findAssetFiles(assetPaths);
  const dupeFiles = await findDupeFileSet(assetFiles);

  return {
    assetFiles,
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
