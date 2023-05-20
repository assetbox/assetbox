import { App } from "@assetbox/manager";
import type { AssetBoxData } from "@assetbox/tools";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

export const render = (url: string, data: AssetBoxData) => {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App data={data} />
    </StaticRouter>
  );
};
