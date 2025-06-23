import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  type User,
  type Unsubscribe,
  onIdTokenChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { backendHttp } from "../constants";

// Hook function
export function getAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Must pass in context provider for authContext");
  }
  return context;
}

// AuthContext definition
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  userIdToken: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>({
  currentUser: null,
  isAuthenticated: false,
  isLoadingAuth: true,
  userIdToken: undefined,
});

// AuthProvider definition
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [userIdToken, setUserIdToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        setCurrentUser(user);
        setIsLoadingAuth(false);
        if (user) setUserIdToken(await user?.getIdToken());
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setUserIdToken(await user.getIdToken());
      } else {
        setUserIdToken(undefined);
      }
      setIsLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoadingAuth,
        userIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export async function authenticateWithBackend(request: string) {
  let idToken = null;
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("No user logged in, cannot make authentication call");
      return;
    }
    idToken = await currentUser.getIdToken();
    console.log("Firebase auth successful");
  } catch (firebaseAuthError) {
    console.error("Firebase auth unsuccessful");
  }
  try {
    console.log("authenticating with backend");
    console.log(backendHttp);
    const response = await fetch(backendHttp + `/${request}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.ok) {
      console.log("Backend authenticated");
    } else {
      console.error("Backend authentication failed");
    }
  } catch (networkError) {
    console.error("Network failure: " + networkError);
  }
}
