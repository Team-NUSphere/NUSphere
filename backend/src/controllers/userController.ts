import User from "#db/models/User.js";
import { firebaseAuth } from "#firebase-admin.js";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;
  const { newUsername } = req.body as { newUsername: string };

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  if (!newUsername || newUsername.length < 3 || newUsername.length > 30) {
    res
      .status(400)
      .json({ error: "Username must be between 3 and 30 characters" });
    return;
  }

  try {
    const token: string = authHeader.split(" ")[1];
    const firebaseUser: DecodedIdToken =
      await firebaseAuth.verifyIdToken(token);
    const uid: string = firebaseUser.uid;

    const user = await User.findByPk(uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await user.updateUsername(newUsername);
    res.status(200).json({
      message: "Username updated successfully",
      username: newUsername,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "Username already taken") {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;
  const { newPassword } = req.body as { newPassword: string };

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  try {
    const token: string = authHeader.split(" ")[1];
    const firebaseUser: DecodedIdToken =
      await firebaseAuth.verifyIdToken(token);
    const uid: string = firebaseUser.uid;

    await firebaseAuth.updateUser(uid, {
      password: newPassword,
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  try {
    const token: string = authHeader.split(" ")[1];
    const firebaseUser: DecodedIdToken =
      await firebaseAuth.verifyIdToken(token);
    const uid: string = firebaseUser.uid;

    const user = await User.findByPk(uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      uid: user.uid,
      username: user.username,
    });
  } catch (err) {
    next(err);
  }
};
