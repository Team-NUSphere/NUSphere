import { firebaseAuth } from "#firebase-admin.js";
import User from "#models/User.js";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

const handleSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }
  const token: string = authHeader.split(" ")[1];
  const user: DecodedIdToken = await firebaseAuth.verifyIdToken(token);
  const uid: string = user.uid;
  const duplicate = await User.findOne({ where: { uid: uid } });
  if (duplicate) res.sendStatus(401);
  try {
    const result = await User.create({ uid: uid });
    res.sendStatus(200);
    console.log(result.toJSON());
  } catch (err) {
    next(err);
  }
};

export default handleSignUp;
