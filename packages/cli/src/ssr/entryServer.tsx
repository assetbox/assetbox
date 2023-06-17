import { App } from "@assetbox/manager";
import type { AssetBoxData } from "@assetbox/tools";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

export const render = (base: string, url: string, data: AssetBoxData) => {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url} basename={base}>
      <App data={data} />
    </StaticRouter>
  );
};
