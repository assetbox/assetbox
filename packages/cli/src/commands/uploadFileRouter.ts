import {
  createFileHash,
  cwd,
  getDupeFiles,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { type RequestHandler, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

export const uploadFileRouter = Router();

const uploadAsset = (savePath?: string) =>
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const resolvePath = savePath
          ? path.resolve(cwd(), savePath)
          : req.body.savePath;

        if (typeof savePath == "undefined") {
          savePath = req.body.savePath;
        }

        if (!fs.existsSync(resolvePath)) {
          console.log("create dir");
          fs.mkdirSync(resolvePath);
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
      .join(sep);
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
function convertImageObject(imageObject: ImageObject): ConvertedResult[] {
  const result: ConvertedResult[] = [];

  for (const key in imageObject) {
    // eslint-disable-next-line no-prototype-builtins
    if (imageObject.hasOwnProperty(key)) {
      const savePath = key;
      const base64Image = "";
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

  const getAddedFiles = fs.readdirSync(cwd() + "/.assetbox/"); // 추가된 파일 watingValidation 폴더에서 가져오기

  const fileList: { path: string; hash: string }[] = [];

  getAddedFiles.map(async (file) => {
    const json = { path: "", hash: "" };
    json.path = req.body.savePath + "/" + file;
    json.hash = await createFileHash(cwd() + "/.assetbox/" + file);
    fileList.push(json);
  });

  const result = await getDupeFiles(assetFiles, fileList);
  const convertedResult: ConvertedResult[] = convertImageObject(result);
  fs.rmdirSync(cwd() + "/.assetbox", { recursive: true });
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
