import fs from "fs";
import { resolve } from "path";

export const mergeDupeFileSet = async (dupFiles: string[]) => {
  dupFiles.forEach(async (file, index) => {
    if (index == 0) {
      fs.rename(file, file + "_merged.png", (err) => {
        if (err) {
          throw new Error("File merge error when renaming");
        }
      });
    } else {
      fs.unlink(file, (err) => {
        if (err) {
          throw new Error("File merge error when deleting");
        }
      });
    }
  });

  return true;
};
