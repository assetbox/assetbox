import { appRouter } from "@assetbox/trpc";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";

import { resolveCliRoot } from "../utils/path";
export const createServer = async () => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);

  const createContext = ({
    req,
    res,
  }: trpcExpress.CreateExpressContextOptions) => ({}); // no context
  type Context = inferAsyncReturnType<typeof createContext>;
  app.use(express.json());
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
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

      const { render } = await vite.ssrLoadModule(entryServerModulePath);
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as any);
      next(e);
    }
  });

  app.listen(5173);
};
