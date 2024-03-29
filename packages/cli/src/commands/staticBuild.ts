import { cwd, readAssetBoxConfig } from "@assetbox/tools";
import react from "@vitejs/plugin-react";
import { readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import { sep } from "path";
import copy from "rollup-plugin-copy";
import { build } from "vite";

import { renderStaticHtml } from "../context/renderStaticHtml";
import { resolveCliRoot, resolveProjectRoot } from "../utils/path";

export const staticBuild = async () => {
  const { categories, staticBuild = {} } = await readAssetBoxConfig();

  const outDir = staticBuild.outDir ?? "assetbox-dist";
  const base = staticBuild.base ?? "/";
  const mode = staticBuild.mode ?? "app";

  const assetFiles = Object.values(categories).flat();

  const normalizeFilePaths = assetFiles.map((filePath) =>
    relative(cwd(), filePath)
  );

  let template = await readFile(
    resolveCliRoot("ssr", "templates", "index.html"),
    "utf-8"
  );
  template = template
    .replace("<!--css-outlet-->", resolveCliRoot("ssr", "style.css"))
    .replace(
      "<!--entry-client-outlet-->",
      resolveCliRoot("ssr", "entryClient.js")
    );
  await writeFile(resolveCliRoot("ssr", "templates", "index.html"), template);

  await build({
    root: resolveCliRoot("ssr", "templates"),
    base,
    configFile: false,
    plugins: [
      react(),
      copy({
        targets: [{ src: assetFiles, dest: join(outDir, "assets") }],
        onlyFiles: true,
      }),
    ],
    publicDir: false,
    build: {
      emptyOutDir: false,
      outDir: resolveProjectRoot(outDir),
      chunkSizeWarningLimit: 1500,
    },
    define: {
      "process.env.BUILD": "true",
      "process.env.MODE": `'${mode}'`,
    },
  });

  global.process.env.BUILD = "true";
  global.process.env.BUILD = `'${mode}'`;

  template = await readFile(resolveProjectRoot(outDir, "index.html"), "utf-8");
  const html = await renderStaticHtml(template, base, "/", {
    onlyCategories: true,
  });
  const staticHtml = normalizeFilePaths.reduce((originHtml, filePath) => {
    const filename = filePath.split(sep).pop();
    if (!filename) {
      return originHtml;
    }

    const filePathReg = new RegExp(filePath, "g");
    return originHtml.replace(filePathReg, join("assets", filename));
  }, html);

  await writeFile(resolveProjectRoot(outDir, "index.html"), staticHtml);
};
