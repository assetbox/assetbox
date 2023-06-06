import {
  createFileHash,
  cwd,
  getDupeFiles,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { type RequestHandler, Router } from "express";
import fs from "fs";
import multer from "multer";
import path, { join, sep } from "path";

export const uploadFileRouter = Router();

const uploadAsset = (savePath?: string) =>
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const resolvePath = savePath
          ? join(cwd(), sep, savePath)
          : join(cwd(), sep, req.body.savePath);

        if (!fs.existsSync(`${resolvePath}`)) {
          fs.mkdirSync(`${resolvePath}`);
        }
        cb(null, resolvePath);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  });

const uploadFile: RequestHandler = async (req, res) => {
  try {
    const checkingPath = [cwd(), req.body.savePath, req.file?.originalname]
      .filter(Boolean)
      .join(path.sep);

    if (!fs.existsSync(checkingPath)) {
      res.status(400).json({ message: "Asset upload Failed" });
    }

    res.status(201).json({ message: "Asset uploaded successfully" });
  } catch (e) {
    throw new Error("Asset upload Error" + e);
  }
};

interface ImageObject {
  [key: string]: string[];
}

interface ConvertedResult {
  savePath: string;
  base64Image: string;
  dupePaths: string[];
}
function getExtension(name: string) {
  const extension = name.split(".").pop()!;

  if (["svg"].includes(extension)) {
    return "svg+xml";
  }
  return extension;
}
function convertImageObject(imageObject: ImageObject): ConvertedResult[] {
  const result: ConvertedResult[] = [];

  for (const key in imageObject) {
    // eslint-disable-next-line no-prototype-builtins
    if (imageObject.hasOwnProperty(key)) {
      const fileNameWithExtension = key.substring(key.lastIndexOf(sep) + 1);

      const extension = getExtension(
        path.join(cwd(), sep, ".assetbox", sep, fileNameWithExtension)
      );

      const savePath = key;
      console.log(extension);
      const prefix = ["data:image", `${extension};base64`].join(sep);

      const base64Image = `${prefix},${fs.readFileSync(
        path.join(cwd(), sep, ".assetbox", sep, fileNameWithExtension),
        {
          encoding: "base64",
        }
      )}`;
      const dupePaths = imageObject[key];

      result.push({
        savePath,
        base64Image,
        dupePaths,
      });
    }
  }

  return result;
}

const getValidationInfo: RequestHandler = async (req, res) => {
  const { categories } = await readAssetBoxConfig();
  const assetFiles = Object.values(categories).flat(); // 모든파일

  const getAddedFiles = fs.readdirSync(path.join(cwd(), sep, ".assetbox", sep)); // 추가된 파일 watingValidation 폴더에서 가져오기
  console.log(getAddedFiles);
  const fileList: { path: string; hash: string }[] = [];

  getAddedFiles.map(async (file) => {
    const json = { path: "", hash: "" };
    json.path = path.join(req.body.savePath, sep, file);
    json.hash = await createFileHash(
      path.join(cwd(), sep, ".assetbox", sep, file)
    );
    fileList.push(json);
  });
  console;

  const result = await getDupeFiles(assetFiles, fileList);
  const convertedResult: ConvertedResult[] = convertImageObject(result);
  fs.rmdirSync(path.join(cwd(), sep, ".assetbox"), { recursive: true });
  res.status(201).json([...convertedResult]);
};
const test: RequestHandler = async (req, res) => {
  try {
    res.status(200).send("Asset upload Test");
  } catch (e) {
    throw new Error("Asset upload Test Error" + e);
  }
};

uploadFileRouter.post("/", uploadAsset().single("assets"), uploadFile);
uploadFileRouter.post(
  "/validation",
  uploadAsset("/.assetbox").array("assets"),
  getValidationInfo
);
uploadFileRouter.get("/", test);
