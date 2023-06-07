import { build } from "esbuild";

import packageJson from "./package.json" assert { type: "json" };

Promise.all([
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    format: "cjs",
    platform: "node",
    outfile: "./dist/index.cjs",
  }),
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    format: "esm",
    platform: "node",
    outfile: "./dist/index.mjs",
  }),
]);
