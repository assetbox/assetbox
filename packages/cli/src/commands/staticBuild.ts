import { findFilePathsFromGlob, readAssetBoxConfig } from "@assetbox/tools";
import react from "@vitejs/plugin-react-swc";
import { readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import copy from "rollup-plugin-copy";
import { renderStaticHtml } from "src/context/renderStaticHtml";
import { build } from "vite";
import { findPackageRoot } from "workspace-tools";

import { resolveCliRoot, resolveProjectRoot } from "../utils/path";

export const staticBuild = async () => {
  const { assetPaths } = await readAssetBoxConfig();
  const filePaths = await findFilePathsFromGlob(assetPaths);
  const normalizeFilePaths = filePaths.map((filePath) =>
    relative(findPackageRoot(process.cwd())!, filePath)
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
        targets: [{ src: assetPaths, dest: join("assetbox-dist", "assets") }],
        onlyFiles: true,
      }),
    ],
    publicDir: false,
    build: {
      outDir: resolveProjectRoot("assetbox-dist"),
    },
  });

  template = await readFile(
    resolveProjectRoot("assetbox-dist", "index.html"),
    "utf-8"
  );
  const html = await renderStaticHtml(template, "/");
  const staticHtml = normalizeFilePaths.reduce((originHtml, filePath) => {
    const filename = filePath.split("/").pop();
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
