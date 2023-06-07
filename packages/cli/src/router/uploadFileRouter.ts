import {
  createFileHash,
  cwd,
  getDupeFiles,
  readAssetBoxConfig,
} from "@assetbox/tools";
import { type RequestHandler, Router } from "express";
import { existsSync } from "fs";
import { mkdir, readdir, readFile, rm } from "fs/promises";
import multer from "multer";
import { join, resolve, sep } from "path";

interface ImageObject {
  [key: string]: string[];
}

interface ConvertedResult {
  savePath: string;
  base64Image: string;
  dupePaths: string[];
}

export const uploadFileRouter = Router();

const tmpDir = resolve(cwd(), "node_modules", ".assetbox", "tmp");

const uploadAsset = (savePath?: string) =>
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const resolvePath = savePath
          ? join(cwd(), savePath)
          : join(cwd(), req.body.savePath);

        if (!existsSync(resolvePath)) {
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
      .join(sep);

    if (!existsSync(checkingPath)) {
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
  const imageObjects: ConvertedResult[] = [];

  for (const key in imageObject) {
    const fileName = key.split(sep).pop()!;

    const extension = getExtension(join(tmpDir, fileName));

    const savePath = key;
    const prefix = ["data:image", `${extension};base64, `].join(sep);

    const base64Image = [
      prefix,
      await readFile(join(tmpDir, fileName), {
        encoding: "base64",
      }),
    ].join("");

    const dupePaths = imageObject[key];

    imageObjects.push({
      savePath,
      base64Image,
      dupePaths,
    });
  }
  return imageObjects;
};

const getValidationInfo: RequestHandler = async (req, res) => {
  const { categories } = await readAssetBoxConfig();

  const assetFiles = Object.values(categories).flat();
  const getAddedFiles = await readdir(tmpDir);

  const addedFileHashes = await Promise.all(
    getAddedFiles.map(async (file) => {
      return {
        path: resolve(req.body.savePath, file),
        hash: await createFileHash(join(tmpDir, file)),
      };
    })
  );

  const dupeFiles = await getDupeFiles(assetFiles, addedFileHashes);
  const convertedResult: ConvertedResult[] = await convertImageObject(
    dupeFiles
  );

  rm(tmpDir, { recursive: true });
  res.status(201).json(convertedResult);
};

uploadFileRouter.post("/", uploadAsset().single("assets"), uploadFile);
uploadFileRouter.post(
  "/validation",
  uploadAsset(join("node_modules", ".assetbox", "tmp")).array("assets"),
  getValidationInfo
);
