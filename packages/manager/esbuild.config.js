import { build } from "esbuild";
import svgr from "esbuild-plugin-svgr";

import packagesJson from "./package.json" assert { type: "json" };
Promise.all([
  build({
    entryPoints: ["./src/entry.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "cjs",
    plugins: [svgr()],
    external: Object.keys({
      ...packagesJson.dependencies,
      ...packagesJson.devDependencies,
    }).filter((key) => !["react-dnd", "react-dnd-html5-backend"].includes(key)),
    platform: "node",
    outfile: "./dist/entry.cjs",
  }),
  build({
    entryPoints: ["./src/entry.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    plugins: [svgr()],
    external: Object.keys({
      ...packagesJson.dependencies,
      ...packagesJson.devDependencies,
    }),
    platform: "browser",
    outfile: "./dist/entry.mjs",
  }),
]);
