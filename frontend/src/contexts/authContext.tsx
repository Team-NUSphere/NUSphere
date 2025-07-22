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
import { backend } from "../constants";
import axiosApi from "../functions/axiosApi";
import type { TelegramUser } from "../components/TelegramLoginButton";
import { getTelegramId } from "../functions/classSwapApi";

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
  telegramId: number | undefined;
  setTelegramId: (id: number | undefined) => void; // Function to update Telegram ID
}

const AuthContext = createContext<AuthContextType | undefined>({
  currentUser: null,
  isAuthenticated: false,
  isLoadingAuth: true,
  userIdToken: undefined,
  telegramId: undefined,
  setTelegramId: () => {}, // Default function that does nothing
});

// AuthProvider definition
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [userIdToken, setUserIdToken] = useState<string | undefined>(undefined);
  const [telegramId, setTelegramId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchTelegramId = async () => {
      try {
        const response = await getTelegramId();
        if (response && response.telegramId) {
          setTelegramId(response.telegramId);
        }
      } catch (error) {
        console.error("Failed to fetch Telegram ID:", error);
      }
    };
    if (currentUser) {
      fetchTelegramId();
    }
  }, [currentUser]);

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

  useEffect(() => {
    const interceptor = axiosApi.interceptors.request.use(
      (config) => {
        if (userIdToken) {
          config.headers.Authorization = `Bearer ${userIdToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    return () => {
      axiosApi.interceptors.request.eject(interceptor);
    };
  }, [userIdToken]);

  useEffect(() => {
    const interceptor = axiosApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            console.log("Refreshing token...");
            const newAccessToken = await auth.currentUser?.getIdToken();
            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              setUserIdToken(newAccessToken);
              return axiosApi(originalRequest);
            }
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            return Promise.reject(error);
          }
        }
      }
    );
    return () => {
      axiosApi.interceptors.response.eject(interceptor);
    };
  }, [userIdToken]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoadingAuth,
        userIdToken,
        telegramId,
        setTelegramId: setTelegramId, // Expose setTelegramId for updates
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
    const response = await fetch(backend + `/${request}`, {
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

export async function authenticateTelegram(user: TelegramUser) {
  const res = await axiosApi({
    method: "POST",
    url: "/telegram/register",
    data: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
      auth_date: user.auth_date,
      hash: user.hash,
    },
  });
  return res.status === 200;
}
