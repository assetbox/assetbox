import react from "@vitejs/plugin-react-swc";
import { build as esbuild } from "esbuild";
import { copy } from "esbuild-plugin-copy";
import esbuildSvgr from "esbuild-plugin-svgr";
import { build as viteBuild } from "vite";
import viteSvgr from "vite-plugin-svgr";

import packageJson from "../package.json" assert { type: "json" };

const cliBuild = () =>
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
    format: "cjs",
    platform: "node",
    external: Object.keys({
      ...packageJson.dependencies,
    }),
    outfile: "./bin/main.cjs",
  });

const managerBuild = async () => {
  await viteBuild({
    plugins: [
      react(),
      viteSvgr({
        exportAsDefault: true,
      }),
    ],
    build: {
      lib: {
        entry: "./src/ssr/entryClient.tsx",
        formats: ["es"],
        fileName: "entryClient",
      },
      outDir: "./bin/ssr",
    },
    define: {
      "process.env": "process.env",
    },
  });

  await esbuild({
    entryPoints: ["./src/ssr/entryServer.tsx"],
    bundle: true,
    format: "cjs",
    external: ["isomorphic-dompurify", "react", "react-router-dom"],
    platform: "node",
    outfile: "./bin/ssr/entryServer.cjs",
    plugins: [esbuildSvgr({})],
  });
};

const build = async () => {
  await managerBuild();
  await cliBuild();
};

build();
