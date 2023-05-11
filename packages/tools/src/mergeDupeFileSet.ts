import fs from "fs";
import { resolve } from "path";
export const mergeDupeFileSet = async (
  dupeFiles: string[],
  newPathAndName: string
) => {
  try {
    const fileExtension = dupeFiles[0].split(".").pop();

    dupeFiles.forEach((fileSet, index) => {
      if (index == 0) {
        fs.renameSync(fileSet, newPathAndName + "." + fileExtension);
      } else {
        fs.unlinkSync(fileSet);
      }
    });

    return {
      isMerged: true,
      newPathAndName: newPathAndName + "." + fileExtension,
    };
  } catch (e) {
    throw new Error("Error Occured in mergeDupeFileSet: " + e + "");
  }
};
