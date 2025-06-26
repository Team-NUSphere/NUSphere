import handleCreateRoom from "#controllers/roomController.js";
import { Router } from "express";

const router = Router();
router.get("/create", handleCreateRoom);

export default router;
