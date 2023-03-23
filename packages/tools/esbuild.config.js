import { build } from "esbuild";

Promise.all([
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "cjs",
    platform: "node",
    outfile: "./dist/index.cjs",
  }),
  build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    platform: "node",
    outfile: "./dist/index.mjs",
  }),
]);
