import { Router } from "express";
import { getResult } from "../controllers/ai-controller.js";
import { isUser } from "../middlewares/auth-middleware.js";

const router = Router();

router.get("/get-result", isUser, getResult);

export default router;
