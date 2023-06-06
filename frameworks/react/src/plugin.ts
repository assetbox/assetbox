import {
  cwd,
  getAllDirectoriesRecursive,
  type IconBuildPlugin,
} from "@assetbox/tools";
import { transformAsync } from "@babel/core";
import { transform } from "@svgr/core";
import camelCase from "camelcase";
import { existsSync } from "fs";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join, relative, resolve, sep } from "path";
import pc from "picocolors";

const buildSvg = async ({
  outDir,
  categoryName,
  filePaths,
}: {
  outDir: string;
  categoryName: string;
  filePaths: string[];
}) => {
  const generatedPaths = await Promise.all(
    filePaths.map(async (filePath) => {
      const extension = filePath.split(".").pop();
      if (extension && !["svg"].includes(extension)) {
        return [];
      }

      const filename = filePath.split(sep).pop()?.split(".").shift();

      const componentName = [
        camelCase(filename!, {
          pascalCase: true,
        }),
        "Icon",
      ].join("");

      const svg = await readFile(resolve(filePath), "utf-8");

      const component = await transform(
        svg,
        {
          icon: true,
          ref: true,
          titleProp: true,
          plugins: ["@svgr/plugin-jsx"],
        },
        { componentName }
      );

      const transformESM = await transformAsync(component, {
        plugins: [[require("@babel/plugin-transform-react-jsx")]],
      });

      if (!transformESM || !transformESM.code) {
        throw new Error(
          `'${filePath}' @babel/plugin-transform-react-jsx failed`
        );
      }

      const transformCJS = await transformAsync(transformESM.code, {
        plugins: [[require("@babel/plugin-transform-modules-commonjs")]],
      });

      if (!transformCJS || !transformCJS.code) {
        throw new Error(
          `'${filePath}' @babel/plugin-transform-react-jsx failed`
        );
      }

      const esmPath = resolve(
        cwd(),
        outDir,
        "esm",
        categoryName.toLocaleLowerCase()
      );
      const cjsPath = resolve(
        cwd(),
        outDir,
        "cjs",
        categoryName.toLocaleLowerCase()
      );

      if (!existsSync(esmPath)) {
        await mkdir(esmPath, {
          recursive: true,
        });
      }
      if (!existsSync(cjsPath)) {
        await mkdir(cjsPath, {
          recursive: true,
        });
      }

      const esmCodePath = join(esmPath, `${componentName}.mjs`);
      const cjsCodePath = join(cjsPath, `${componentName}.cjs`);

      await Promise.all([
        writeFile(
          join(esmPath, `${componentName}.mjs`),
          transformESM.code
        ).then(() =>
          console.log(
            "Processing (ESM)",
            pc.yellow(`${relative(cwd(), filePath)}`),
            " => ",
            pc.green(join(outDir, "esm", `${componentName}.mjs`))
          )
        ),
        writeFile(
          join(cjsPath, `${componentName}.cjs`),
          transformCJS.code
        ).then(() =>
          console.log(
            "Processing (CJS)",
            pc.yellow(`${relative(cwd(), filePath)}`),
            " => ",
            pc.green(join(outDir, "cjs", `${componentName}.cjs`))
          )
        ),
      ]);

      return [esmCodePath, cjsCodePath];
    })
  );

  return generatedPaths.flat();
};

export const react = (): IconBuildPlugin => ({
  name: "react-icon",
  build: async ({ categories, iconBuild }) => {
    const outDir = iconBuild!.outDir!;

    await Promise.all(
      Object.entries(categories).map(async ([categoryName, filePaths]) => {
        return buildSvg({
          outDir,
          categoryName,
          filePaths,
        });
      })
    );

    const directories = await getAllDirectoriesRecursive(
      resolve(cwd(), outDir)
    );
    const indexFilePaths = directories.map((directory) => {
      if (directory.includes("cjs")) {
        return resolve(cwd(), outDir, directory, "index.cjs");
      }
      return resolve(cwd(), outDir, directory, "index.mjs");
    });

    for (const indexFilePath of indexFilePaths) {
      const root = indexFilePath.split(sep).slice(0, -1).join(sep);
      const iconPaths = await readdir(root);

      const indexContent = iconPaths
        .map((iconPath) => {
          const [filename] = iconPath.split(".");
          if (filename === "index") {
            return null;
          }

          return `export * from "./${filename}"`;
        })
        .filter(Boolean)
        .join("\n");

      if (indexFilePath.includes("cjs")) {
        const indexContextCJS = await transformAsync(indexContent, {
          plugins: [[require("@babel/plugin-transform-modules-commonjs")]],
        });

        if (!indexContextCJS?.code) {
          throw new Error(
            `'${indexFilePath}' @babel/plugin-transform-modules-commonjs failed`
          );
        }

        writeFile(indexFilePath, indexContextCJS.code);
      } else {
        writeFile(indexFilePath, indexContent);
      }
    }
  },
});
