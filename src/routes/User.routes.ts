import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser, searchUsers, updateCoverImage } from "../controllers/User.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/getUser").get(verifyJwt, getUser);
router.route("/searchUser").get(searchUsers);
router.route("/updatecoverImage").post(verifyJwt, upload.fields([{name:"coverImage",maxCount:1}]), updateCoverImage);
router.route("/register").post(upload.fields([{name:"avatar", maxCount:1}]), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);

export default router;