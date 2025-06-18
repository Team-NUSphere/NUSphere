import handleAuthentication from "#controllers/authController.js";
import { Router } from "express";

const router = Router();
const authenticatedRoutes = ["/userTimetable"];

authenticatedRoutes.forEach((route) => {
  router.use(route, handleAuthentication);
});

export default router;
