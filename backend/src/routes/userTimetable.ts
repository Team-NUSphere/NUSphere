import {
  handleCreateNewEvent,
  handleDeleteEvent,
  handleDeleteModule,
  handleGetAllEvents,
  handleGetAllUserModules,
  handleRegisterModule,
  handleUpdateClasses,
  handleUpdateEvent,
} from "#controllers/userTimetableController.js";
import { Router } from "express";

const router = Router();
router
  .route("/events")
  .get(handleGetAllEvents)
  .post(handleCreateNewEvent)
  .put(handleUpdateEvent)
  .delete(handleDeleteEvent);

router
  .route("/modules/:moduleCode")
  .post(handleRegisterModule)
  .put(handleUpdateClasses)
  .delete(handleDeleteModule);

router.get("/modules", handleGetAllUserModules);

export default router;
