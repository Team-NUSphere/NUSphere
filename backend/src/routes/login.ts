import handleSignIn from "#controllers/loginController.js";
import { Router } from "express";

const router = Router();
router.post("/", handleSignIn);

export default router;
