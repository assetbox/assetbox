import { existsSync } from "fs";
import { mkdir } from "fs/promises";

export const mkdirWithCheck = async (path: string) => {
  if (!existsSync(path)) {
    await mkdir(path, {
      recursive: true,
    });
  }
};

export const pipe = async <T>(value: T) => value;
