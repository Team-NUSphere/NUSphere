import {
  getUserProfile,
  updatePassword,
  updateUsername,
} from "#controllers/userController.js";
import { Router } from "express";

const router = Router();

router.route("/profile").get(getUserProfile);

router.route("/username").put(updateUsername);
router.route("/password").put(updatePassword);

export default router;
