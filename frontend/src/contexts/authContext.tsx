import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User, type Unsubscribe } from "firebase/auth";
import { auth } from "../firebase";

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

export function getAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Must pass in context provider for authContext");
  }
  return context;
}

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
      value={{ currentUser, isAuthenticated: !!currentUser, isLoadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
