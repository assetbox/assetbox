import {
  findAssetFiles,
  findDupeFileSet,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { appRouter } from "@assetbox/trpc";
import {
  type CreateExpressContextOptions,
  createExpressMiddleware,
} from "@trpc/server/adapters/express";
import express from "express";
import fs from "fs";
import { relative } from "path";
import { createServer as createViteServer } from "vite";

import { resolveCliRoot } from "../utils/path";

const getAssetBoxData = async () => {
  const { assetPaths } = await readAssetBoxConfig();

  const assetFiles = await findAssetFiles(assetPaths);
  const dupeFiles = await findDupeFileSet(assetFiles);

  return {
    assetFiles: assetFiles.map((assetFile) =>
      relative(process.cwd(), assetFile)
    ),
    dupeFiles,
  };
};

export const createServer = async () => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    publicDir: false,
  });
  app.use(vite.middlewares);

  const createContext = ({ req, res }: CreateExpressContextOptions) => ({}); // no context

  app.use(express.json());
  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

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

      const entryServerModulePath = resolveCliRoot("ssr", "entryServer.mjs");

      const ssrData = await getAssetBoxData();

      const { render } = await vite.ssrLoadModule(entryServerModulePath);
      const appHtml = await render(url, ssrData);

      const html = template
        .replace("<!--ssr-outlet-->", appHtml)
        .replace("<!--data-outlet-->", JSON.stringify(ssrData));

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as any);
      next(e);
    }
  });

  app.listen(5173);
};
