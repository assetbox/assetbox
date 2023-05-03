import { readFile } from "fs/promises";

export const convertFilesToStrings = async (filePaths: string[]) => {
  return Promise.all(filePaths.map((filePath) => readFile(filePath, "utf8")));
};
