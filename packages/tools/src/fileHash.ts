// eslint-disable-next-line simple-import-sort/imports
import crypto from "crypto";
import { readFile } from "node:fs/promises";
import { findAssetPaths } from "./findAssetPaths";

const createFileHash = async (file: string) => {
  try {
    const data = await readFile(file);
    const hash = crypto
      .createHash("md5")
      .update(data as unknown as string, "utf-8")
      .digest("hex");
    return { [file]: hash };
  } catch (error) {
    console.error(error);
  }
};

const compareHash = async (file: any) => {
  const input = file;
  const output = [];

  const uniqueHashes = new Set(Object.values(input));

  for (const hash of uniqueHashes) {
    const fileNames = Object.keys(input).filter(
      (fileName) => input[fileName] === hash
    );

    if (fileNames.length !== 1) {
      output.push(fileNames);
    }
  }
  return output;
};

export const fileHash = async () => {
  const assetFile = await findAssetPaths();
  let result;

  Promise.all(assetFile.map((file) => createFileHash(file)))
    .then(async (res) => {
      const sortObject = res.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});
      result = await compareHash(sortObject);
    })
    .catch((error) => {
      console.error(error);
    });
  return result;
};
