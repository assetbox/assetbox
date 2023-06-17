import type { GetAssetBoxOptions } from "@assetbox/tools";
import { getAssetBoxData } from "@assetbox/tools";

import { resolveCliRoot } from "../utils/path";

export const renderStaticHtml = async (
  template: string,
  base: string,
  url: string,
  options?: GetAssetBoxOptions
) => {
  const entryServerModulePath = resolveCliRoot("ssr", "entryServer.cjs");

  const ssrData = await getAssetBoxData(options);

  const { render } = await import(entryServerModulePath);
  const appHtml = await render(base, url, ssrData);

  return template
    .replace("<!--ssr-outlet-->", appHtml)
    .replace("<!--data-outlet-->", JSON.stringify(ssrData));
};
