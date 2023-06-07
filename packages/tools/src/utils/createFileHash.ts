import crypto from "crypto";
import { readFile } from "fs/promises";

export const createFileHash = async (file: string) => {
  const data = await readFile(file);
  const hash = crypto
    .createHash("md5")
    .update(data as unknown as string, "utf-8")
    .digest("hex");
  return hash;
};
