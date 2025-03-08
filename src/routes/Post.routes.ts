import { Router } from "express";
import { createPost, getPost, likePost } from "../controllers/Post.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/auth.middleware";
import { Verify } from "crypto";
const router = Router();

router.route("/createPost").post(verifyJwt, upload.fields([{name:"image", maxCount:1}]),createPost);
router.route("/getPost").get(verifyJwt, getPost);
router.route("/likePost").get(verifyJwt, likePost);

export default router;