import react from "@vitejs/plugin-react-swc";
import { readFile, writeFile } from "fs/promises";
import { renderStaticHtml } from "src/context/renderStaticHtml";
import { build } from "vite";

import { resolveCliRoot, resolveProjectRoot } from "../utils/path";

export const staticBuild = async () => {
  let template = await readFile(
    resolveCliRoot("ssr", "templates", "index.html"),
    "utf-8"
  );
  template = template.replace(
    "<!--entry-client-outlet-->",
    resolveCliRoot("ssr", "entryClient.mjs")
  );
  await writeFile(resolveCliRoot("ssr", "templates", "index.html"), template);

  await build({
    root: resolveCliRoot("ssr", "templates"),
    plugins: [react()],
    build: {
      outDir: resolveProjectRoot("assetbox-dist"),
    },
  });

  template = await readFile(
    resolveProjectRoot("assetbox-dist", "index.html"),
    "utf-8"
  );
  const html = await renderStaticHtml(template, "/");
  await writeFile(resolveProjectRoot("assetbox-dist", "index.html"), html);
};
