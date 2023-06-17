import { cwd } from "@assetbox/tools";
import { transformAsync } from "@babel/core";
import { transform } from "@svgr/core";
import camelCase from "camelcase";
import { mkdir, readFile, writeFile } from "fs/promises";
import { resolve, sep } from "path";
import {
  type CompilerOptions,
  createCompilerHost,
  createProgram,
} from "typescript";

export const getComponentNamesFromFilePaths = (
  categoryName: string,
  filePaths: string[]
) => {
  return filePaths
    .map((filePath) => {
      const fileName = filePath.split(sep).pop();
      const fileNameTokens = fileName?.split(".") ?? ["", ""];

      if (
        !fileNameTokens[1] ||
        (fileNameTokens[1] && !["svg"].includes(fileNameTokens[1]))
      ) {
        return null;
      }

      const componentName = camelCase(fileNameTokens[0], {
        pascalCase: true,
      });

      return {
        categoryName: categoryName.toLocaleLowerCase(),
        componentName,
        filePath,
      };
    })
    .filter(Boolean);
};

export const getComponentNamesFromCategories = async (
  categories: Record<string, string[]>
) => {
  return (
    await Promise.all(
      Object.entries(categories).map(async ([categoryName, filePaths]) => {
        return getComponentNamesFromFilePaths(categoryName, filePaths);
      })
    )
  ).flat();
};

export const convertToReactComponent = (
  componentsNames: Awaited<ReturnType<typeof getComponentNamesFromCategories>>
) =>
  Promise.all(
    componentsNames.map(async ({ categoryName, componentName, filePath }) => {
      const svgData = await readFile(resolve(filePath), "utf-8");

      const typescript = await transform(
        svgData,
        {
          typescript: true,
          icon: true,
          jsx: {
            babelConfig: {
              plugins: ["@babel/plugin-transform-react-jsx"],
            },
          },
          exportType: "named",
          namedExport: componentName,
          plugins: ["@svgr/plugin-jsx"],
        },
        { componentName }
      );
      const componentEsmCode = await transformAsync(typescript, {
        plugins: [require("@babel/plugin-transform-typescript")],
      });
      if (!componentEsmCode || !componentEsmCode.code) {
        throw new Error("@babel/plugin-transform-typescript error");
      }

      const componentCjsCode = await transformAsync(componentEsmCode.code, {
        plugins: [require("@babel/plugin-transform-modules-commonjs")],
      });

      if (!componentCjsCode || !componentCjsCode.code) {
        throw new Error("@babel/plugin-transform-modules-commonjs error");
      }

      return {
        categoryName,
        componentName,
        componentCode: {
          typescript,
          esm: componentEsmCode.code,
          cjs: componentCjsCode.code,
        },
        filePath,
      };
    })
  );

export const compileDts = (
  sources: Awaited<ReturnType<typeof convertToReactComponent>>
) => {
  const options: CompilerOptions = {
    declaration: true,
    emitDeclarationOnly: true,
  };
  const sourceMap = sources.reduce<Record<string, (typeof sources)[0]>>(
    (acc, source) => ({
      ...acc,
      [`${source.categoryName}/${source.componentName}.ts`]: source,
    }),
    {}
  );

  const host = createCompilerHost(options);
  host.writeFile = (fileName: string, contents: string) => {
    const _fileName = `${fileName.split(".").shift()}.ts`;
    if (sourceMap[_fileName]) {
      sourceMap[_fileName].componentCode.typescript = contents;
    }
  };

  const originReadFile = host.readFile;

  host.readFile = (fileName: string, ...args) => {
    if (sourceMap[fileName]) {
      return sourceMap[fileName].componentCode.esm;
    }
    return originReadFile(fileName, ...args);
  };

  const dummyFiles = Object.keys(sourceMap);
  const program = createProgram(dummyFiles, options, host);
  program.emit();

  return Object.values(sourceMap);
};

export const saveComponents =
  (outDir: string) =>
  async (components: Awaited<ReturnType<typeof convertToReactComponent>>) => {
    const categoryNames = [
      ...new Set(components.map((component) => component.categoryName)),
    ];

    const categoryPaths = [];
    for (const categoryName of categoryNames) {
      const path = {
        esm: resolve(cwd(), outDir, "esm", categoryName),
        cjs: resolve(cwd(), outDir, "cjs", categoryName),
        types: resolve(cwd(), outDir, "types", categoryName),
        categoryName,
      };

      await Promise.all([
        mkdir(path.esm, {
          recursive: true,
        }),
        mkdir(path.cjs, {
          recursive: true,
        }),
        mkdir(path.types, {
          recursive: true,
        }),
      ]);

      categoryPaths.push(path);
    }

    const componentsWithSavePath = await Promise.all(
      components.map(async (component) => {
        const makeSavePath = (format: "esm" | "cjs" | "types") => {
          let extension = "js";
          if (format === "cjs") {
            extension = "cjs";
          } else if (format === "types") {
            extension = "d.ts";
          }

          return resolve(
            cwd(),
            outDir,
            format,
            component.categoryName,
            [component.componentName, extension].join(".")
          );
        };
        const savePath = {
          esm: makeSavePath("esm"),
          cjs: makeSavePath("cjs"),
          types: makeSavePath("types"),
        };

        await Promise.all([
          writeFile(savePath.esm, component.componentCode.esm),
          writeFile(savePath.cjs, component.componentCode.cjs),
          writeFile(savePath.types, component.componentCode.typescript),
        ]);

        return {
          ...component,
          savePath,
        };
      })
    );

    return { components: componentsWithSavePath, categoryPaths };
  };

export const indexTemplate = async ({
  categoryPaths,
  components,
}: Awaited<ReturnType<ReturnType<typeof saveComponents>>>) => {
  const indexPaths = categoryPaths.map((path) => ({
    esm: [path.esm, "index.js"].join(sep),
    cjs: [path.cjs, "index.cjs"].join(sep),
    types: [path.types, "index.d.ts"].join(sep),
  }));

  await Promise.all(
    indexPaths.map(async (indexPath) => {
      const importState = {
        esm: components
          .filter((component) => indexPath.esm.includes(component.categoryName))
          .map(
            (component) => `export * from './${component.componentName}.js';`
          )
          .join("\n"),
        cjs: components
          .filter((component) => indexPath.cjs.includes(component.categoryName))
          .map(
            (component) => `export * from './${component.componentName}.cjs';`
          )
          .join("\n"),
        types: components
          .filter((component) =>
            indexPath.types.includes(component.categoryName)
          )
          .map((component) => `export * from './${component.componentName}';`)
          .join("\n"),
      };

      await writeFile(indexPath.esm, importState.esm);
      await writeFile(indexPath.types, importState.types);

      const commonjs = await transformAsync(importState.cjs, {
        plugins: [[require("@babel/plugin-transform-modules-commonjs")]],
      });
      if (!commonjs || !commonjs.code) {
        throw new Error("@babel/plugin-transform-modules-commonjs error");
      }

      await writeFile(indexPath.cjs, commonjs.code);
    })
  );
  return categoryPaths;
};
