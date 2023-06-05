import { type AssetBoxScheme, cwd, getCategoryFileList } from "@assetbox/tools";
import { transformAsync } from "@babel/core";
import { transform } from "@svgr/core";
import camelCase from "camelcase";
import fs from "fs/promises";
import { resolve, sep } from "path";

const buildSvg = async (categoryName: string, filePaths: string[]) => {
  return Promise.all(
    filePaths.map(async (filePath) => {
      const componentName = [
        camelCase(filePath.split(sep).pop()!, {
          pascalCase: true,
        }),
        "Icon",
      ].join("");

      const svg = await fs.readFile(resolve(filePath), "utf-8");

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

      await fs.writeFile(
        resolve(cwd(), "esm", categoryName, `${componentName}.mjs`),
        transformESM.code
      );
      await fs.writeFile(
        resolve(cwd(), "cjs", categoryName, `${componentName}.cjs`),
        transformCJS.code
      );
    })
  );
};

export const react = () => ({
  name: "react-icon",
  build: async ({ categories }: AssetBoxScheme) => {
    const categoryFileList = await getCategoryFileList(categories);

    await Promise.all(
      Object.entries(categoryFileList).map(
        async ([categoryName, filePaths]) => {
          return buildSvg(categoryName, filePaths);
        }
      )
    );
  },
});
