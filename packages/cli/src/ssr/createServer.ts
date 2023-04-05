import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

export const createServer = async () => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs
        .readFileSync(
          path.resolve(__dirname, "ssr", "templates", "index.html"),
          "utf-8"
        )
        .replace(
          "<!--entry-client-outlet-->",
          path.resolve(__dirname, "ssr", "entryClient.mjs")
        );
      template = await vite.transformIndexHtml(url, template);

      const entryServerModulePath = path.resolve(
        __dirname,
        "ssr",
        "entryServer.mjs"
      );

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
