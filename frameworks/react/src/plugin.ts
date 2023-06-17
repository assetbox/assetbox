import { cwd, type IconBuildPlugin } from "@assetbox/tools";
import cliProgress from "cli-progress";
import { readFile, writeFile } from "fs/promises";
import { relative } from "path";
import pc from "picocolors";
import prompts from "prompts";

import {
  compileDts,
  convertToReactComponent,
  getComponentNamesFromCategories,
  indexTemplate,
  saveComponents,
} from "./core";
import { pipe } from "./utils";

export type ReactPluginOptions = {
  outDir: string;
};

export const react = (
  { outDir }: ReactPluginOptions = {
    outDir: "dist",
  }
): IconBuildPlugin => ({
  name: "react-icon",
  build: async ({ categories }) => {
    const progress = new cliProgress.SingleBar(
      {
        format: " {bar} | {task} | {value}/{total}",
      },
      cliProgress.Presets.shades_classic
    );

    const startProgress =
      (task: string) =>
      async <T>(value: T) => {
        progress.start(4, 0, {
          task,
        });
        return value;
      };

    const updateProgress = (task: string) => {
      return async <T>(value: T) => {
        progress.increment({ task });
        return value;
      };
    };

    await pipe(categories)
      .then(startProgress("Get Component Names From Categories"))
      .then(getComponentNamesFromCategories)
      .then(updateProgress("Convert to React Component"))
      .then(convertToReactComponent)
      .then(updateProgress("Compile d.ts"))
      .then(compileDts)
      .then(updateProgress("Save Components"))
      .then(saveComponents(outDir))
      .then(updateProgress("Generate Index"))
      .then(indexTemplate)
      .then(async (categoryPaths) => {
        progress.stop();

        const exportsField = categoryPaths
          .map((categoryPath) => ({
            [`./${categoryPath.categoryName}`]: {
              types: `./${relative(cwd(), categoryPath.types)}/index.d.ts`,
              import: `./${relative(cwd(), categoryPath.esm)}/index.js`,
              require: `./${relative(cwd(), categoryPath.cjs)}/index.cjs`,
            },
          }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {});

        console.log(pc.green("Icon Build complete."));
        console.log();
        console.log(pc.green("Please write the output on `package.json`"));
        console.log(
          JSON.stringify(
            {
              files: [relative(cwd(), outDir), "package.json"],
              exports: exportsField,
            },
            null,
            2
          )
        );

        const { shouldChange } = await prompts({
          type: "confirm",
          name: "shouldChange",
          message: "Can you change your package.json?",
          initial: true,
        });
        if (shouldChange) {
          const packageJson = JSON.parse(
            await readFile("package.json", "utf-8")
          ) as Record<string, any>;

          packageJson["files"] = [
            ...new Set([
              ...(packageJson?.["files"] ?? []),
              relative(cwd(), outDir),
            ]),
          ];
          packageJson["exports"] = {
            ...(packageJson?.["exports"] ?? {}),
            ...exportsField,
          };

          await writeFile("package.json", JSON.stringify(packageJson, null, 2));
        }
      });
  },
});
