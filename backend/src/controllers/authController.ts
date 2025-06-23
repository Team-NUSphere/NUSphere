import User from "#db/models/User.js";
import { firebaseAuth } from "#firebase-admin.js";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

// include custom property user in Request interface
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

const handleAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log("in auth controller");
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
    const found = await User.findOne({ where: { uid: uid } });
    if (!found) {
      res.sendStatus(500);
      return;
    }
    req.user = found;
    next();
  } catch (err) {
    next(err);
  }
};

export default handleAuthentication;
