import { build as esbuild } from "esbuild";
import { copy } from "esbuild-plugin-copy";

import packagesJson from "./package.json" assert { type: "json" };

const ENTRY_COMMON_OPTIONS = {
  bundle: true,
  external: ["react", "react-dom", "react-router-dom", "@assetbox/manager"],
};

const build = async () => {
  Promise.all([
    esbuild({
      entryPoints: ["./src/main.ts"],
      plugins: [
        copy({
          resolveFrom: "cwd",
          assets: {
            from: ["./src/ssr/templates/*"],
            to: ["./bin/ssr/templates"],
          },
        }),
      ],
      bundle: true,
      minify: true,
      sourcemap: true,
      format: "cjs",
      platform: "node",
      external: Object.keys({
        ...packagesJson.dependencies,
        ...packagesJson.devDependencies,
      }),
      outfile: "./bin/main.cjs",
      define: {
        "import.meta.env.ESBUILD_PROD": '"true"',
      },
    }),
    esbuild({
      entryPoints: ["./src/ssr/entryServer.tsx"],
      ...ENTRY_COMMON_OPTIONS,
      format: "cjs",
      platform: "node",
      outfile: "./bin/ssr/entryServer.cjs",
    }),
    esbuild({
      entryPoints: ["./src/ssr/entryClient.tsx"],
      ...ENTRY_COMMON_OPTIONS,
      format: "esm",
      platform: "browser",
      outfile: "./bin/ssr/entryClient.mjs",
    }),
  ]);
};

build();
