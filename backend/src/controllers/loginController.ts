import { firebaseAuth } from "#firebase-admin.js";
import { UserModel } from "#models/database.js";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

import handleSignUp from "./registerController.js";

const handleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }
  const idToken: string = authHeader.split(" ")[1];
  const user: DecodedIdToken = await firebaseAuth.verifyIdToken(idToken);
  const uid: string = user.uid;
  try {
    let found = await UserModel.findOne({ where: { uid: uid } });
    if (!found) {
      await handleSignUp(req, res, next);
      found = await UserModel.findOne({ where: { uid: uid } });
      return;
    }
    res.sendStatus(200);
    console.log(found.toJSON());
  } catch (err) {
    next(err);
  }
};

export default handleSignIn;
