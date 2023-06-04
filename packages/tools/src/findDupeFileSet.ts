import crypto from "crypto";
import { readFile } from "fs/promises";
import { relative } from "path";

import { cwd } from "./cwd";

export const createFileHash = async (file: string) => {
  const data = await readFile(file);
  const hash = crypto
    .createHash("md5")
    .update(data as unknown as string, "utf-8")
    .digest("hex");
  return hash;
};

const compareHash = (fileHashMap: Record<string, string>) => {
  const input = fileHashMap;
  const outputs = [];

  const uniqueHashes = new Set(Object.values(input));

  for (const hash of uniqueHashes) {
    const fileNames = Object.keys(input)
      .filter((fileName) => input[fileName] === hash)
      .map((fileName) => relative(cwd(), fileName));

    if (fileNames.length > 1) {
      outputs.push(fileNames);
    }
  }
  return outputs;
};

export const findDupeFileSet = async (assetFiles: string[]) => {
  const fileHashes = await Promise.all(
    assetFiles.map(async (file) => ({
      [file]: await createFileHash(file),
    }))
  );

  const fileHashMap = fileHashes.reduce(
    (result, fileHash) => ({
      ...result,
      ...fileHash,
    }),
    {} as Record<string, string>
  );

  return compareHash(fileHashMap);
};

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

  const results: { [key: string]: string[] } = {};

  addedFiles.forEach((file) => {
    const filePath = relative(cwd(), file.path);
    const dupHashList = fileHashes
      .filter((hash) => Object.values(hash)[0] === file.hash)
      .map((hash) => relative(cwd(), Object.keys(hash)[0]));

    if (filePath in results) {
      console.log("드래그 앤 드롭으로 추가한 파일에 중복된 파일이 존재함.");
    }

    results[filePath] = results[filePath] || [];
    if (dupHashList.length !== 0) {
      results[filePath] = dupHashList;
    }
  });

  return results;
};
