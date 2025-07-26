import {
  handleGetGroupSummary,
  handleGetPostSummary,
} from "#controllers/summaryController.js";
import { Router } from "express";

const router = Router();

router.get("/group/:groupId", handleGetGroupSummary);
router.get("/post/:postId", handleGetPostSummary);

export default router;
