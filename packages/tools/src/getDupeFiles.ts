import { relative } from "path";

import { cwd } from "./cwd";
import { createFileHash } from "./utils";

export const getDupeFiles = async (
  assetFiles: string[],
  addedFiles: {
    path: string;
    hash: string;
  }[]
) => {
  const fileHashes = await Promise.all(
    assetFiles.map(async (file) => ({
      [file]: await createFileHash(file),
    }))
  );

  return addedFiles.reduce((acc, file) => {
    const filePath = relative(cwd(), file.path);
    const dupeHashes = fileHashes
      .filter((hash) => Object.values(hash)[0] === file.hash)
      .map((hash) => relative(cwd(), Object.keys(hash)[0]));

    return {
      ...acc,
      [filePath]: dupeHashes.length > 0 ? dupeHashes : acc[filePath] ?? [],
    };
  }, {} as Record<string, string[]>);
};
