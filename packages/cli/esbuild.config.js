import { build } from "esbuild";

import packagesJson from "./package.json" assert { type: "json" };

build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: 'cjs',
    external: Object.keys(packagesJson.devDependencies),
    platform: 'node',
    outfile: './bin/main.cjs',
})
