import { Router } from "express";
import { createPost, getPost, getUserPost, likePost } from "../controllers/Post.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/auth.middleware";
const router = Router();

router.route("/createPost").post(verifyJwt, upload.fields([{name:"image", maxCount:1}]),createPost);
router.route("/getPost").get(verifyJwt, getPost);
router.route("/likePost").post(verifyJwt, likePost);
router.route("/getUserPost").get(verifyJwt, getUserPost);

export default router;