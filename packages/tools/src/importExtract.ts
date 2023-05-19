import { readFile } from "fs/promises";
import { relative, sep } from "path";

import { cwd } from "./cwd";

const extractImportedFiles = async (file: string) => {
  const fileContent = await readFile(file);

  const importStatements = fileContent
    .toString()
    .match(
      new RegExp(
        `import\\s+([^;]*)\\s+from\\s+(['"])(.*\\.(svg|png|jpg|jpeg|bmp|gif|webp))\\2|require\\(['"](.+\\.(svg|png|jpg|jpeg|bmp|gif|webp))['"]\\)|await\\s+import\\(['\\"](.*\\.(svg|png|jpg|jpeg|bmp|gif|webp))['\\"]\\)`,
        "g"
      )
    );

  const fileNameRegEx = new RegExp(
    "(?<=/)[^/]+(?=\\.\\w+$)|(?<=/)[^/]+(?='|\")",
    "g"
  );

  const extractedFileNames =
    importStatements
      ?.map((importStatement) => importStatement.match(fileNameRegEx))
      .flat()
      .filter(Boolean) ?? [];
  return extractedFileNames as string[];
};

const mapFileReferences = (
  assetFiles: string[],
  importFiles: Record<string, string[]>
) => {
  const fileReferences: Record<string, string[]> = {};

  assetFiles.forEach((fileName) => {
    fileReferences[fileName] = [];
  });

  Object.keys(importFiles).forEach((importName) => {
    const importedFiles = importFiles[importName];

    importedFiles.forEach((fileName) => {
      if (fileReferences[fileName]) {
        fileReferences[fileName].push(importName);
      }
    });
  });

  return fileReferences;
};

export const findImportFileSet = async (
  assetFiles: string[],
  trackingFiles: string[]
) => {
  const importFiles = await Promise.all(
    trackingFiles.map(async (file) => ({
      [relative(cwd(), file)]: await extractImportedFiles(file),
    }))
  );
  const importFileMap = importFiles.reduce((acc, curr) => {
    return {
      ...acc,
      ...curr,
    };
  }, {} as Record<string, string[]>);

  const assetFileNames = assetFiles.map(
    (file) => file.split(sep).pop() as string
  );

  return mapFileReferences(assetFileNames, importFileMap);
};
