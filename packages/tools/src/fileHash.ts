import { readFile } from "node:fs/promises";

import crypto from "crypto";

const createFileHash = async (file: string) => {
  const data = await readFile(file);
  const hash = crypto
    .createHash("md5")
    .update(data as unknown as string, "utf-8")
    .digest("hex");
  return hash;
};

const compareHash = (fileHashMap: Record<string, string>) => {
  const input = fileHashMap;
  const output = [];

  const uniqueHashes = new Set(Object.values(input));

  for (const hash of uniqueHashes) {
    const fileNames = Object.keys(input).filter(
      (fileName) => input[fileName] === hash
    );

    if (fileNames.length > 1) {
      output.push(fileNames);
    }
  }
  return output;
};

export const findUniqueFileSet = async (assetFiles: string[]) => {
  const fileHashes = await Promise.all(
    assetFiles.map(async (file) => ({ [file]: await createFileHash(file) }))
  );
  const filehashMap = fileHashes.reduce(
    (result, fileHash) => ({
      ...result,
      ...fileHash,
    }),
    {} as Record<string, string>
  );

  return compareHash(filehashMap);
};
