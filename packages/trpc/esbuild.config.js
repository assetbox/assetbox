import { build } from "esbuild";

import packagesJson from "./package.json" assert { type: "json" };
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
});
