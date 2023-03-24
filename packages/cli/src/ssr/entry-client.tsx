import { App } from "@assetbox/manager";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.hydrateRoot(
  document.getElementById("root") as Element,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
