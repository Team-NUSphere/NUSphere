import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User, type Unsubscribe } from "firebase/auth";
import { auth } from "../firebase";

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
}

const AuthContext = createContext<AuthContextType | undefined>({
  currentUser: null,
  isAuthenticated: false,
  isLoadingAuth: true,
});

// AuthProvider definition
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    setIsLoadingAuth(true);
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        if (user) {
          setCurrentUser(user);
        }
        setIsLoadingAuth(false);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoadingAuth,
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
    const response = await fetch(
      `https://nusphere-2d33b7b9d756.herokuapp.com/${request}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    if (response.ok) {
      console.log("Backend authenticated");
    } else {
      console.error("Backend authentication failed");
    }
  } catch (networkError) {
    console.error("Network failure");
  }
}
