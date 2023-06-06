import {
  createFileHash,
  cwd,
  getDupeFiles,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { type RequestHandler, Router } from "express";
import fs from "fs";
import { mkdir, readdir, readFile, rmdir } from "fs/promises";
import multer from "multer";
import path, { join, sep } from "path";

interface ImageObject {
  [key: string]: string[];
}

interface ConvertedResult {
  savePath: string;
  base64Image: string;
  dupePaths: string[];
}

export const uploadFileRouter = Router();

const uploadAsset = (savePath?: string) =>
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const resolvePath = savePath
          ? join(cwd(), sep, savePath)
          : join(cwd(), sep, req.body.savePath);

        if (!fs.existsSync(resolvePath)) {
          mkdir(resolvePath);
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

const getExtension = (name: string) => {
  const extension = name.split(".").pop()!;

  if (["svg"].includes(extension)) {
    return "svg+xml";
  }
  return extension;
};

const convertImageObject = async (
  imageObject: ImageObject
): Promise<ConvertedResult[]> => {
  const result: ConvertedResult[] = [];

  for (const key in imageObject) {
    const fileName = key.split(sep).pop()!;

    const extension = getExtension(
      path.join(cwd(), sep, ".assetbox", sep, fileName)
    );

    const savePath = key;
    const prefix = ["data:image", `${extension};base64`].join(sep);

    const base64Image = [
      prefix,
      await readFile(path.join(cwd(), sep, ".assetbox", sep, fileName), {
        encoding: "base64",
      }),
    ].join("");

    const dupePaths = imageObject[key];

    result.push({
      savePath,
      base64Image,
      dupePaths,
    });
  }
  return result;
};

const getValidationInfo: RequestHandler = async (req, res) => {
  const { categories } = await readAssetBoxConfig();
  const assetFiles = Object.values(categories).flat();

  const getAddedFiles = await readdir(path.join(cwd(), sep, ".assetbox", sep));

  const fileList = getAddedFiles.map(async (file: string) => {
    const json = {
      path: join(req.body.savePath, file),
      hash: await createFileHash(path.join(cwd(), sep, ".assetbox", sep, file)),
    };
    return json;
  });
  console;

  const result = await getDupeFiles(assetFiles, await Promise.all(fileList));
  const convertedResult: ConvertedResult[] = await convertImageObject(result);

  rmdir(path.join(cwd(), sep, ".assetbox"), { recursive: true });
  res.status(201).json(convertedResult);
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
