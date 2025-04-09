import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { getNotifications } from "../controllers/Notification.controller";

const router = Router();

router.route("/getNotifications").post(verifyJwt, getNotifications);

export default router;