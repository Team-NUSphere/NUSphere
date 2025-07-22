import {
  handleCancelRequest,
  handleCreateSwapRequest,
  handleFulfilledRequest,
  handleGetAllLessonClasses,
  handleGetOwnRequests,
} from "#controllers/classSwapController.js";
import { handleGetTelegramId } from "#telegramBot.js";
import { Router } from "express";

const router = Router();
router.get("/lessons/:moduleCode", handleGetAllLessonClasses);

router.route("/new").post(handleCreateSwapRequest);

router.route("/requests").get(handleGetOwnRequests);

router.route("/telegram").get(handleGetTelegramId);

router
  .route("/requests/:requestId")
  .put(handleFulfilledRequest)
  .delete(handleCancelRequest);

export default router;
