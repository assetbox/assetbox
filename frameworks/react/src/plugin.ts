import { cwd, type IconBuildPlugin } from "@assetbox/tools";
import { transformAsync } from "@babel/core";
import { transform } from "@svgr/core";
import camelCase from "camelcase";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join, relative, resolve, sep } from "path";
import pc from "picocolors";

const buildSvg = async ({
  outdir,
  categoryName,
  filePaths,
}: {
  outdir: string;
  categoryName: string;
  filePaths: string[];
}) => {
  return Promise.all(
    filePaths.map(async (filePath) => {
      const extension = filePath.split(".").pop();
      if (extension && !["svg"].includes(extension)) {
        return;
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
        outdir,
        "esm",
        categoryName.toLocaleLowerCase()
      );
      const cjsPath = resolve(
        cwd(),
        outdir,
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

      await Promise.all([
        writeFile(
          join(esmPath, `${componentName}.mjs`),
          transformESM.code
        ).then(() =>
          console.log(
            "Processing (ESM)",
            pc.yellow(`${relative(cwd(), filePath)}`),
            " => ",
            pc.green(join(outdir, "esm", `${componentName}.mjs`))
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
            pc.green(join(outdir, "cjs", `${componentName}.cjs`))
          )
        ),
      ]);
    })
  );
};

export const react = (): IconBuildPlugin => ({
  name: "react-icon",
  build: async ({ categories, iconBuild }) => {
    await Promise.all(
      Object.entries(categories).map(async ([categoryName, filePaths]) => {
        return buildSvg({
          outdir: iconBuild!.outdir!,
          categoryName,
          filePaths,
        });
      })
    );
  },
});
