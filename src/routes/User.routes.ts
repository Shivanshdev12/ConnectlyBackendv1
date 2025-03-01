import { Router } from "express";
import { loginUser, registerUser } from "../controllers/User.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/register").post(upload.fields([{name:"avatar", maxCount:1}]), registerUser);
router.route("/login").post(loginUser);

export default router;