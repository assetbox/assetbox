import { cwd, readAssetBoxConfig } from "@assetbox/tools";
import react from "@vitejs/plugin-react-swc";
import { readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import { sep } from "path";
import copy from "rollup-plugin-copy";
import { build } from "vite";

import { renderStaticHtml } from "../context/renderStaticHtml";
import { resolveCliRoot, resolveProjectRoot } from "../utils/path";

export const staticBuild = async () => {
  const { categories } = await readAssetBoxConfig();
  const assetFiles = Object.values(categories).flat();

  const normalizeFilePaths = assetFiles.map((filePath) =>
    relative(cwd(), filePath)
  );

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
    plugins: [
      react(),
      copy({
        targets: [{ src: assetFiles, dest: join("assetbox-dist", "assets") }],
        onlyFiles: true,
      }),
    ],
    publicDir: false,
    build: {
      outDir: resolveProjectRoot("assetbox-dist"),
    },
    define: {
      "process.env.BUILD": "true",
    },
  });

  global.process.env.BUILD = "true";

  template = await readFile(
    resolveProjectRoot("assetbox-dist", "index.html"),
    "utf-8"
  );
  const html = await renderStaticHtml(template, "/", true);
  const staticHtml = normalizeFilePaths.reduce((originHtml, filePath) => {
    const filename = filePath.split(sep).pop();
    if (!filename) {
      return originHtml;
    }

    const filePathReg = new RegExp(filePath, "g");
    return originHtml.replace(filePathReg, join("assets", filename));
  }, html);

  await writeFile(
    resolveProjectRoot("assetbox-dist", "index.html"),
    staticHtml
  );
};
