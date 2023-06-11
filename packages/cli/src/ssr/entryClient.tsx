import "react-toastify/dist/ReactToastify.css";
import "@assetbox/manager/dist/index.css";

import { App } from "@assetbox/manager";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.hydrateRoot(
  document.getElementById("root") as Element,
  <BrowserRouter>
    <App data={window.__ASSET_DATA__} />
  </BrowserRouter>
);
