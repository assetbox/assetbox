import { readAssetBoxConfig } from "@assetbox/tools";
import { appRouter } from "@assetbox/trpc";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";

import { renderStaticHtml } from "../context/renderStaticHtml";
import { uploadFileRouter } from "../router/uploadFileRouter";
import { resolveCliRoot } from "../utils/path";

// Create Asset Manager Server
export const manage = async (port?: number) => {
  const { port: configPort = 6001 } = await readAssetBoxConfig();

  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    publicDir: false,
    define: {
      "process.env.BUILD": "false",
    },
  });
  app.use(vite.middlewares);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: () => ({}),
    })
  );

  app.use("/upload", uploadFileRouter);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs
        .readFileSync(resolveCliRoot("ssr", "templates", "index.html"), "utf-8")
        .replace(
          "<!--entry-client-outlet-->",
          resolveCliRoot("ssr", "entryClient.mjs")
        );
      template = await vite.transformIndexHtml(url, template);

      const html = await renderStaticHtml(template, url);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as any);
      next(e);
    }
  });

  app.listen(port || configPort, () => {
    console.log(
      `📦 AssetBox is running at http://localhost:${port || configPort}`
    );
  });
};
