import { Router } from "express";
import { createPost } from "../controllers/Post.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/auth.middleware";
const router = Router();

router.route("/createPost").post(verifyJwt, upload.fields([{name:"image", maxCount:1}]),createPost);

export default router;