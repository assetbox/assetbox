import { build as esbuild } from "esbuild";
import { copy } from "esbuild-plugin-copy";

import packagesJson from "./package.json" assert { type: "json" };

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
      external: Object.keys({
        ...packagesJson.dependencies,
        ...packagesJson.devDependencies,
      }),
      platform: "node",
      outfile: "./bin/main.cjs",
      define: {
        "import.meta.env.ESBUILD_PROD": '"true"',
      },
    }),
    esbuild({
      entryPoints: ["./src/ssr/entryServer.tsx"],
      bundle: true,
      format: "cjs",
      external: ["react", "react-dom", "react-router-dom", "@assetbox/manager"],
      platform: "node",
      outfile: "./bin/ssr/entryServer.cjs",
    }),
    esbuild({
      entryPoints: ["./src/ssr/entryClient.tsx"],
      bundle: true,
      format: "esm",
      external: ["react", "react-dom", "react-router-dom", "@assetbox/manager"],
      platform: "browser",
      outfile: "./bin/ssr/entryClient.mjs",
    }),
  ]);
};

build();
