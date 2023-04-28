import { build } from "esbuild";

import packagesJson from "./package.json" assert { type: "json" };
Promise.all([
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "cjs",
    external: Object.keys({
      ...packagesJson.devDependencies,
      ...packagesJson.peerDependencies,
    }),
    platform: "node",
    outfile: "./dist/index.cjs",
  }),
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    external: Object.keys({
      ...packagesJson.devDependencies,
      ...packagesJson.peerDependencies,
    }),
    platform: "browser",
    outfile: "./dist/index.mjs",
  }),
]);
