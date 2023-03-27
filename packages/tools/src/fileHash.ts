import { readFileSync } from "node:fs";

import crypto from "crypto";

import { findAssetPaths } from "./findAssetPaths";

const createFileHash = (file: string) => {
  const data = readFileSync(file);
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

export const createFileHashMap = async () => {
  const assetFiles = await findAssetPaths();
  console.log(assetFiles);

  const fileHashes = await Promise.all(
    assetFiles.map((file) => ({ [file]: createFileHash(file) }))
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
