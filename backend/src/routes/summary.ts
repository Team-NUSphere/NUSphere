import { Router } from "express";
import { handleRunSummary } from "#controllers/summaryController.js";

const router = Router();

router
  .route("/runSummary")
  .post(handleRunSummary)

export default router;