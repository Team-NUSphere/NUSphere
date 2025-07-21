import { Router } from "express";

import { handleTelegramAuthentication } from "../telegramBot.js";

const router = Router();
router.post("/register", handleTelegramAuthentication);

export default router;
