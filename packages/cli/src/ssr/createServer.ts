import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

export const createServer = async () => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    // resolve: {
    //   alias: {
    //     "@assetbox/manager": path.resolve(
    //       process.cwd(),
    //       "../../manager/dist/entry.mjs"
    //     ),
    //   },
    // },
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(
        path.resolve(process.cwd(), "templates", "index.html"),
        "utf-8"
      );
      template = await vite.transformIndexHtml(url, template);

      const entryServerModulePath = import.meta.env.ESBUILD_PROD
        ? path.resolve(process.cwd(), "ssr", "entryServer.cjs")
        : path.resolve(process.cwd(), "entryServer.tsx");

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
