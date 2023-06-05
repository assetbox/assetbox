import { getAssetBoxData } from "@assetbox/tools";

import { resolveCliRoot } from "../utils/path";

export const renderStaticHtml = async (
  template: string,
  url: string,
  onlyCategories: boolean
) => {
  const entryServerModulePath = resolveCliRoot("ssr", "entryServer.cjs");

  const ssrData = await getAssetBoxData({ onlyCategories });

  const { render } = await import(entryServerModulePath);
  const appHtml = await render(url, ssrData);

  return template
    .replace("<!--ssr-outlet-->", appHtml)
    .replace("<!--data-outlet-->", JSON.stringify(ssrData));
};
