import { type RequestHandler, Router } from "express";
import multer from "multer";
export const uploadFileRouter = Router();
const upload = multer({ dest: __dirname + "/public/uploads/" });

const uploadFile: RequestHandler = async (req, res) => {
  try {
    const files = req;
    console.log(files);
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
uploadFileRouter.post("/", uploadFile);
uploadFileRouter.get("/", test);
module.exports = uploadFileRouter;
