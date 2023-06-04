import { createFileHash, cwd } from "@assetbox/tools";
import { type RequestHandler, Router } from "express";
import md5File from "md5-file";
import multer from "multer";
export const uploadFileRouter = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname); //
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //
  },
});

const upload = multer({ storage: storage });

const uploadFile: RequestHandler = async (req, res) => {
  try {
    const files: any = req.files;
    console.log(files);
    /* 
    md5 기반 해쉬 구하는 로직
    */

    md5File(files[0].path).then((hash) => {
      console.log(`The hash of files[0].path is: ${hash}`);
    });
    /*
    중복 validation check 로직 구현
    */

    res.status(406).json({ message: "Asset uploaded successfully" });
  } catch (e) {
    throw new Error("Asset upload Error" + e);
  }
};
const test: RequestHandler = async (req, res) => {
  try {
    res.status(200).send("Asset upload Test");
  } catch (e) {
    throw new Error("Asset upload Test Error" + e);
  }
};
uploadFileRouter.post("/", upload.array("assets"), uploadFile);
uploadFileRouter.get("/", test);
