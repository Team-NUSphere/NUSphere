import { handleRunSummary } from "#controllers/summaryController.js";
import { Router } from "express";

const router = Router();

router.route("/runSummary").post(handleRunSummary);

export default router;
