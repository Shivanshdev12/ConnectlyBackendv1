import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/User.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/getUser").get(verifyJwt, getUser);
router.route("/register").post(upload.fields([{name:"avatar", maxCount:1}]), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);

export default router;