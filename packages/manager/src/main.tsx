import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App
        data={{
          uniqueCoverage: {
            count: 90,
            totalCount: 100,
          },
          usedCoverage: {
            count: 28,
            totalCount: 100,
          },
          categories: {
            Icons: [],
            Images: [],
          },
          usedFiles: {},
          dupeFiles: [],
          folderTree: {},
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
