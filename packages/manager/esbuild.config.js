import { build } from "esbuild";

import packagesJson from "./package.json" assert { type: "json" };

Promise.all([
  build({
    entryPoints: ["./src/entry.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "cjs",
    external: Object.keys({
      ...packagesJson.dependencies,
      ...packagesJson.devDependencies,
    }),
    platform: "node",
    outfile: "./dist/entry.cjs",
  }),
  build({
    entryPoints: ["./src/entry.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    external: Object.keys({
      ...packagesJson.dependencies,
      ...packagesJson.devDependencies,
    }),
    platform: "browser",
    outfile: "./dist/entry.mjs",
  }),
]);
