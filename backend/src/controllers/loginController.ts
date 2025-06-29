import User from "#db/models/User.js";
import { firebaseAuth } from "#firebase-admin.js";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

import handleSignUp from "./registerController.js";

const handleSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;

  // userToken is contained in header Bearer
  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  // Format of header: Bearer userToken, so token can be obtained as such
  const idToken: string = authHeader.split(" ")[1];

  // Firebase
  const user: DecodedIdToken = await firebaseAuth.verifyIdToken(idToken);
  const uid: string = user.uid;

  try {
    // Check for user existence in case we failed to store it during registration
    let found = await User.findOne({ where: { uid: uid } });
    if (!found) {
      // Pass to signup if user isnt found
      await handleSignUp(req, res, next);
      found = await User.findOne({ where: { uid: uid } });
      return;
    }
    res.sendStatus(200);
    console.log(found.toJSON());
  } catch (err) {
    next(err);
  }
};

export default handleSignIn;
