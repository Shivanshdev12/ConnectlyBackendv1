import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { addComment } from "../controllers/Comment.controller";

const router = Router();

router.route("/addComment").post(verifyJwt,addComment);

export default router;