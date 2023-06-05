import { build } from "esbuild";

import packageJson from "./package.json" assert { type: "json" };

Promise.all([
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    external: Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }).filter((key) => !["@assetbox/tools"].includes(key)),
    format: "cjs",
    platform: "node",
    outfile: "./dist/index.cjs",
  }),
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    external: Object.keys({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }).filter((key) => !["@assetbox/tools"].includes(key)),
    format: "esm",
    platform: "node",
    outfile: "./dist/index.mjs",
  }),
]);
