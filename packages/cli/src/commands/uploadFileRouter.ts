import {
  createFileHash,
  cwd,
  getDupeFiles,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { type RequestHandler, Router } from "express";
import fs from "fs";
import multer from "multer";

export const uploadFileRouter = Router();
const uploadAsset = (savePath: string) =>
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        if (!fs.existsSync(cwd() + savePath)) {
          fs.mkdirSync(cwd() + savePath);
        }
        cb(null, cwd() + savePath);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    }),
  });

const uploadFile: RequestHandler = async (req, res) => {
  try {
    const file: any = req.files;
    console.log(file);
    /* 
    md5 기반 해쉬 구하는 로직
    */

    /*
    중복 validation check 로직 구현
    */

    res.status(406).json({ message: "Asset uploaded successfully" });
  } catch (e) {
    throw new Error("Asset upload Error" + e);
  }
};
interface ResultItem {
  path: string[];
  base64Image: string;
}

function transformObject(
  obj: Record<string, string[]>
): Record<string, ResultItem> {
  const transformedObj: Record<string, ResultItem> = {};

  for (const key in obj) {
    const fileName = key.substring(key.lastIndexOf("/") + 1);
    transformedObj[key] = {
      path: obj[key],
      base64Image: fs.readFileSync(cwd() + "/.assetbox/" + fileName, {
        encoding: "base64",
      }),
    };
  }

  return transformedObj;
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
  const transformedObj: Record<string, ResultItem> = transformObject(result);
  fs.rmdirSync(cwd() + "/.assetbox", { recursive: true });
  res.status(201).json({ ...transformedObj });
};
const test: RequestHandler = async (req, res) => {
  try {
    res.status(200).send("Asset upload Test");
  } catch (e) {
    throw new Error("Asset upload Test Error" + e);
  }
};

uploadFileRouter.post(
  "/",
  uploadAsset("/.assetbox").array("assets"),
  uploadFile
);
uploadFileRouter.post(
  "/validation",
  uploadAsset("/.assetbox").array("assets"),
  getValidationInfo
);
uploadFileRouter.get("/", test);
