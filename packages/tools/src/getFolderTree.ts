import { readdir } from "fs/promises";
import { join, sep } from "path";

import { cwd } from "./cwd";
import { FolderTree } from "./types";

const getAllDirectoriesRecursive = async (directoryPath: string) => {
  const files = await readdir(directoryPath, { withFileTypes: true });

  const directories: string[] = [];

  for (const file of files) {
    const filePath = join(directoryPath, file.name);
    if (file.isDirectory()) {
      directories.push(file.name);
      const subDirectories = await getAllDirectoriesRecursive(filePath);
      directories.push(
        ...subDirectories.map((subDirectory) => join(file.name, subDirectory))
      );
    }
  }

  return directories.filter((directory) => !directory.includes("node_modules"));
};

export const getFolderTree = async () => {
  const directories = await getAllDirectoriesRecursive(cwd());

  const result: FolderTree = {};

  for (const directory of directories) {
    const segments = directory.split(sep);

    let current = result;
    for (const segment of segments) {
      if (!current[segment]) {
        current[segment] = {};
      }
      current = current[segment];
    }
  }
  return result;
};
