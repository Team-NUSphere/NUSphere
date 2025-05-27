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
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>({
  currentUser: null,
  isAuthenticated: false,
  isAuthLoading: true,
});

export function getAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    alert("Context error");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        if (user) {
          setCurrentUser(user);
          setIsAuthLoading(false);
        }
      }
    );
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated: !!currentUser, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
