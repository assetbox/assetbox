import { AssetBoxData, findImportFileSet } from "@assetbox/tools";
import {
  findDupeFileSet,
  getCategoryStats,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { resolveCliRoot } from "src/utils/path";

export const getAssetBoxData = async () => {
  const { categories, trackingPaths } = await readAssetBoxConfig();

  const categoryStats = await getCategoryStats(categories);

  const assetFiles = Object.values(categories).flat();
  const dupeFiles = await findDupeFileSet(assetFiles);
  const usedFiles = await findImportFileSet(assetFiles, trackingPaths);

  const usedCount = Object.values(usedFiles).reduce(
    (acc, files) => (files.length > 0 ? acc + 1 : acc),
    0
  );

  return {
    categories: categoryStats,
    usedFiles,
    usedCoverage: {
      count: usedCount,
      totalCount: assetFiles.length,
    },
    dupeFiles,
    uniqueCoverage: {
      count: assetFiles.length - dupeFiles.flat().length,
      totalCount: assetFiles.length,
    },
  } satisfies AssetBoxData;
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
