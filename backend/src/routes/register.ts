import handleSignUp from "#controllers/registerController.js";
import { Router } from "express";

const router = Router();
router.post("/", handleSignUp);

export default router;
