import { Router } from "express";
import {
  getUserProfile,
  updatePassword,
  updateUsername,
} from "#controllers/userController.js";

const router = Router();

router.route("/profile").get(getUserProfile);

router.route("/username").put(updateUsername);
router.route("/password").put(updatePassword);

export default router;
