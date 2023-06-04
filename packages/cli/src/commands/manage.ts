import { appRouter } from "@assetbox/trpc";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

import { renderStaticHtml } from "../context/renderStaticHtml";
import { resolveCliRoot } from "../utils/path";
import { uploadFileRouter } from "./uploadFileRouter";

// Create Asset Manager Server
export const manage = async () => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    publicDir: false,
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

  app.listen(6001, () => {
    console.log("📦 AssetBox is running at http://localhost:6001");
  });
};
