import fs from "fs";
import { resolve } from "path";
export const mergeDupeFileSet = async (dupFiles: string[][]) => {
  try {
    dupFiles.forEach((fileSet) => {
      const renameFile = fileSet[0].split(".");
      const fileExtension = renameFile.pop();

      fileSet.forEach((file, index) => {
        if (index == 0) {
          fs.renameSync(file, renameFile + "_merged." + fileExtension);
        } else {
          fs.unlinkSync(file);
        }
      });
    });
  } catch (e) {
    throw new Error("Error Occured in mergeDupeFileSet: " + e + "");
  }
  return { isMerged: true };
};
