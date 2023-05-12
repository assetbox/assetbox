import fs from "fs";

export const mergeDupeFileSet = async (
  dupeFiles: string[],
  savePath: string
) => {
  try {
    const fileExtension = dupeFiles[0].split(".").pop();

    dupeFiles.forEach((fileSet, index) => {
      if (index == 0) {
        fs.renameSync(fileSet, savePath);
      } else {
        fs.unlinkSync(fileSet);
      }
    });

    return {
      isMerged: true,
    };
  } catch (e) {
    throw new Error("Error Occured in mergeDupeFileSet: " + e + "");
  }
};
