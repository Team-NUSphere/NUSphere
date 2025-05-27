import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Analytics, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCHvWqKscBbak-SzpWgwEoFnzKPGZcPB_A",

  authDomain: "nusphere-2025.firebaseapp.com",

  projectId: "nusphere-2025",

  storageBucket: "nusphere-2025.firebasestorage.app",

  messagingSenderId: "900471985255",

  appId: "1:900471985255:web:c146b06d1c3a305e68b0c2",

  measurementId: "G-6B02FJBWDS",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const analytics: Analytics = getAnalytics(app);

export { app, auth, analytics };
