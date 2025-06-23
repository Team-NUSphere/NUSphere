import {
  handleGetModDetails,
  handleGetModList,
} from "#controllers/moduleController.js";
import { Router } from "express";

const router = Router();
router.get("/modList", handleGetModList);
router.get("/:moduleCode", handleGetModDetails);

export default router;
