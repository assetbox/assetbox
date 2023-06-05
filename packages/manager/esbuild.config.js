import { build } from "esbuild";
import svgr from "esbuild-plugin-svgr";

import packageJson from "./package.json" assert { type: "json" };

Promise.all([
  build({
    entryPoints: ["./src/entry.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "cjs",
    plugins: [svgr()],
    external: Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
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
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }),
    platform: "browser",
    outfile: "./dist/entry.mjs",
  }),
]);
