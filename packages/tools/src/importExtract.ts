import { readFile } from "fs/promises";
import { relative, resolve, sep } from "path";

import { cwd } from "./cwd";

export type ExtractImportData = {
  path: string;
  lineCode: string;
  lineNumber: number;
};

const extractImportedFiles = async (
  assetFiles: string[],
  assetFileNames: string[],
  file: string
) => {
  const fileContent = await readFile(file, "utf-8");
  const regex = new RegExp(
    assetFileNames
      .map(
        (assetFileName) =>
          `"[^"]*${sep}${assetFileName}"|'[^']*${sep}${assetFileName}'`
      )
      .join("|"),
    "g"
  );

  const lineRegex = fileContent.split("\n");

  const matches = (fileContent.match(regex) ?? [])
    .map((match) => {
      const number = lineRegex.findIndex((v) => v.includes(match));
      const code = lineRegex[number];
      const normalizeMatch = match.replace(/['"]/g, "");
      switch (normalizeMatch[0]) {
        case ".": {
          const originPath = resolve(
            file.split(sep).slice(0, -1).join(sep),
            normalizeMatch
          );

          return {
            path: relative(cwd(), originPath),
            lineCode: code,
            lineNumber: number + 1,
          };
        }
        default:
        case "/": {
          const originPath = assetFiles.find((assetFile) =>
            assetFile.includes(normalizeMatch)
          );
          if (!originPath) {
            return null;
          }
          return {
            path: relative(cwd(), originPath),
            lineCode: code,
            lineNumber: number + 1,
          };
        }
      }
    })
    .filter(Boolean);

  return matches;
};

const mapFileReferences = (
  assetFiles: string[],
  importFileMap: Record<string, ExtractImportData[]>
) => {
  const fileReferences: Record<string, ExtractImportData[]> = {};

  assetFiles.forEach((fileName) => {
    fileReferences[fileName] = [];
  });

  Object.keys(importFileMap).forEach((importName) => {
    const importedFiles = importFileMap[importName];

    importedFiles.forEach((fileName) => {
      if (fileReferences[fileName.path]) {
        fileReferences[fileName.path].push({ ...fileName, path: importName });
      }
    });
  });
  return fileReferences;
};

export const findImportFileSet = async (
  assetFiles: string[],
  trackingPaths: string[]
) => {
  const normalizeAssetFiles = assetFiles.map((assetFile) =>
    relative(cwd(), assetFile)
  );
  const assetFileNames = assetFiles.map(
    (assetFile) => assetFile.split(sep).pop() as string
  );

  const importFiles = await Promise.all(
    trackingPaths.map(async (file) => ({
      [relative(cwd(), file)]: await extractImportedFiles(
        assetFiles,
        assetFileNames,
        file
      ),
    }))
  );
  const importFileMap = importFiles.reduce((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  }, {});

  return mapFileReferences(normalizeAssetFiles, importFileMap);
};
