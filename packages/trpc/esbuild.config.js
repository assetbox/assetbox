import { build } from "esbuild";

import packageJson from "./package.json" assert { type: "json" };
build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "cjs",
  external: Object.keys({
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  }),
  platform: "node",
  outfile: "./dist/index.cjs",
});
