import crypto from "crypto";
import fs from "fs";

const createFileHash = async (file: string) => {
  const data = await fs.promises.readFile(file);
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
