import {
  App,
  applicationDefault,
  cert,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseApp = initializeFirebase();

export const firebaseAuth = getAuth();

function initializeFirebase(): App {
  const firebaseKey: ServiceAccount | undefined = process.env
    .FIREBASE_SERVICE_ACCOUNT_KEY
    ? (JSON.parse(
        Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
          "base64",
        ).toString("utf8"),
      ) as ServiceAccount)
    : undefined;

  const firebase: App = initializeApp({
    credential: firebaseKey ? cert(firebaseKey) : applicationDefault(),
  });
  return firebase;
}

export default firebaseApp;
