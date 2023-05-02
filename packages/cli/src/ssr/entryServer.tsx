import { App } from "@assetbox/manager";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

export const render = (
  url: string,
  data: {
    assetFiles: string[];
    dupeFiles: string[];
  }
) => {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App data={data} />
    </StaticRouter>
  );
};
