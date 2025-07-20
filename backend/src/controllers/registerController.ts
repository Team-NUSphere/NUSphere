import User from "#db/models/User.js";
import { firebaseAuth } from "#firebase-admin.js";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

const handleSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader: string | undefined = req.headers.authorization;
  const { username } = req.body;

  // User idtoken stored in header auth bearer after firebase auth
  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  // Strip the token from the header
  const token: string = authHeader.split(" ")[1];

  // Firebase
  const user: DecodedIdToken = await firebaseAuth.verifyIdToken(token);
  const uid: string = user.uid;

  // Check for duplicate in case firebase is tripping
  const duplicate = await User.findOne({ where: { uid: uid } });
  const duplicateUsername = await User.findOne({ where: { username: username } });
  if (duplicate) res.sendStatus(401);
  if (duplicateUsername) {
    res.status(400).json({error: "Username already taken"});
    return;
  }
  try {
    const result = await User.create({ uid: uid, username: username });
    res.sendStatus(200);
    console.log(result.toJSON());
  } catch (err) {
    next(err);
  }
};

export default handleSignUp;
