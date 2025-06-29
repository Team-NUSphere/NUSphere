import {
  handleCreateNewEvent,
  handleDeleteEvent,
  handleDeleteModule,
  handleGetAllEvents,
  handleGetAllUserModules,
  handleRegisterModule,
  handleUpdateClasses,
  handleUpdateEvent,
  handleGetClasses,
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
  .patch(handleUpdateClasses)
  .delete(handleDeleteModule);

router.get("/modules", handleGetAllUserModules);

router.get("/modules/:moduleCode/classes/:lessonType", handleGetClasses);

export default router;
