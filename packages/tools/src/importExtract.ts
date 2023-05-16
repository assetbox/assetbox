import { readFile } from "fs/promises";
import { sep } from "path";

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

  const extractedFileNames = importStatements
    ?.map((importStatement) => importStatement.match(fileNameRegEx))
    .flat();
  return extractedFileNames;
};

export const findImportFileSet = async (
  assetFiles: string[],
  trackingFiles: string[]
) => {
  const importFiles = await Promise.all(
    trackingFiles.map(async (file) => ({
      [file]: await extractImportedFiles(file),
    }))
  );

  const assetFileNames = assetFiles.map((v) => v.split(sep).pop() as string);

  const assetToImportedFiles = assetFileNames.reduce((acc, curr) => {
    const filteredFiles = importFiles.filter((importFile) => {
      const [[key, value]] = Object.entries(importFile);

      if (value?.includes(curr)) {
        return key;
      }
    });

    return {
      ...acc,
      [curr]: filteredFiles.map((file) => Object.keys(file)).flat(),
    };
  }, {} as Record<string, string[]>);

  return assetToImportedFiles;
};
