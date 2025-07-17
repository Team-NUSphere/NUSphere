import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getAuth } from "./authContext";
import { backendRaw } from "../constants";
import type {
  UserClassType,
  UserEventsType,
  UserModulesType,
} from "./timetableContext";
import axiosApi from "../functions/axiosApi";

// Hook function
export function getWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("Must pass in context provider for authContext");
  }
  return context;
}

interface WebSocketContextType {
  webSocket: WebSocket | null;
  isConnected: boolean;
  roomId: string;
  isConnecting: boolean;
  error: string | null;
  connectWebSocket: (room: string) => void;
  terminateWebSocket: () => void;
  createNewRoom: () => void;
  syncedData: {
    [userId: string]: {
      events?: UserEventsType;
      classes?: UserClassType[];
      modules?: UserModulesType;
    };
  } | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const { userIdToken } = getAuth();
  const [syncedData, setSyncedData] = useState<{
    [userId: string]: {
      events?: UserEventsType;
      classes?: UserClassType[];
      modules?: UserModulesType;
    };
  } | null>(null);

  useEffect(() => {
    if (webSocket) {
      webSocket.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      };

      webSocket.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      webSocket.onerror = (event) => {
        setError(
          event instanceof ErrorEvent && event.message
            ? event.message
            : event.type
        );
        setIsConnected(false);
        setIsConnecting(false);
      };

      webSocket.onmessage = (event) => {
        const data: socketDataType | undefined = JSON.parse(event.data);
        if (!data) {
          console.error("Received invalid data from WebSocket:", event.data);
          return;
        }
        handleSocketData(data);
      };
    }
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [webSocket]);

  type socketDataType = {
    type: "create" | "update" | "delete" | "init" | "add" | "remove";
    dataType?: "events" | "classes" | "modules";
    userData?: {
      [userId: string]: {
        events?: UserEventsType;
        classes?: UserClassType[];
        modules?: UserModulesType;
      };
    };
    userId?: string; // for remove and delete operations
    moduleId?: string; // for delete modules
    eventId?: string; // for delete events
  };

  function handleSocketData(data: socketDataType) {
    if (data.type === "init" && data.userData) {
      const { userData } = data;
      setSyncedData(userData);
      return;
    }

    if (data.type === "create") {
      const { userData, dataType } = data;
      if (!userData || !dataType) {
        console.error("Create operation missing userData or dataType");
        return;
      }
      const userId = Object.keys(userData)[0];
      const userDataValue = userData[userId];
      if (!userId || !userDataValue) {
        console.error("Create operation missing userId or userDataValue");
        return;
      }
      const { events, classes, modules } = userDataValue;
      if (dataType === "events" && events) {
        setSyncedData((prevData) => {
          if (!prevData) return { [userId]: { events } };
          return {
            ...prevData,
            [userId]: {
              ...prevData[userId],
              events: {
                ...prevData[userId]?.events,
                ...events,
              },
            },
          };
        });
      } else if (dataType === "modules" && modules) {
        setSyncedData((prevData) => {
          if (!prevData) return { [userId]: { modules } };
          return {
            ...prevData,
            [userId]: {
              ...prevData[userId],
              modules: {
                ...prevData[userId]?.modules,
                ...modules,
              },
              classes: [
                ...(prevData[userId]?.classes || []),
                ...(classes ?? []),
              ],
            },
          };
        });
      } else {
        console.error(
          `Create operation missing events(${events}) or modules(${modules})`
        );
      }
      return;
    }

    if (data.type === "update") {
      const { userData, dataType } = data;
      if (!userData || !dataType) {
        console.error("Update operation missing userData or dataType");
        return;
      }
      const userId = Object.keys(userData)[0];
      const userDataValue = userData[userId];
      if (!userId || !userDataValue) {
        console.error("Create operation missing userId or userDataValue");
        return;
      }
      const { events, classes } = userDataValue;

      if (dataType === "events" && events) {
        setSyncedData((prevData) => {
          if (!prevData) return { [userId]: { events } };
          return {
            ...prevData,
            [userId]: {
              ...prevData[userId],
              events: {
                ...prevData[userId]?.events,
                ...events,
              },
            },
          };
        });
      } else if (dataType === "classes" && classes) {
        const { moduleId, classNo, lessonType } = classes[0];
        setSyncedData((prevData) => {
          if (!prevData) return { [userId]: { classes } };
          const filteredClasses = prevData[userId]?.classes?.filter(
            (lesson) =>
              lesson.moduleId !== moduleId &&
              lesson.classNo !== classNo &&
              lesson.lessonType !== lessonType
          );
          return {
            ...prevData,
            [userId]: {
              ...prevData[userId],
              classes: [...(filteredClasses || []), ...(classes ?? [])],
            },
          };
        });
      } else {
        console.error(
          `Create operation missing events(${events}) or classes(${classes})`
        );
      }
      return;
    }

    if (data.type === "delete") {
      const { userId, dataType, eventId, moduleId } = data;
      if (!userId || !dataType) {
        console.error("Delete operation missing userId or dataType");
        return;
      }
      if (dataType === "events" && eventId) {
        setSyncedData((prevData) => {
          if (!prevData || !prevData[userId]) return prevData;
          const updatedEvents = { ...prevData[userId].events };
          delete updatedEvents[eventId];
          return {
            ...prevData,
            [userId]: {
              ...prevData[userId],
              events: updatedEvents,
            },
          };
        });
      } else if (dataType === "modules" && moduleId) {
        setSyncedData((prevData) => {
          if (!prevData || !prevData[userId]) return prevData;
          const updatedModules = { ...prevData[userId].modules };
          const updatedClasses = prevData[userId].classes?.filter(
            (cls) => cls.moduleId !== moduleId
          );
          delete updatedModules[moduleId];
          return {
            ...prevData,
            [userId]: {
              ...prevData[userId],
              modules: updatedModules,
              classes: updatedClasses || [],
            },
          };
        });
      } else {
        console.error(
          `Delete operation missing eventId(${eventId}) or moduleId(${moduleId})`
        );
      }
      return;
    }

    if (data.type === "add") {
      const { userId, userData } = data;
      if (!userId || !userData) {
        console.error("Add operation missing userId or userData");
        return;
      }
      setSyncedData((prevData) => {
        if (!prevData) return userData;
        return {
          ...prevData,
          ...userData,
        };
      });
      return;
    }

    if (data.type === "remove") {
      const { userId } = data;
      if (!userId) {
        console.error("Remove operation missing userId");
        return;
      }
      setSyncedData((prevData) => {
        if (!prevData || !prevData[userId]) return prevData;
        const updatedData = { ...prevData };
        delete updatedData[userId];
        return updatedData;
      });
      return;
    }
  }

  function connectWebSocket(room: string) {
    if (isConnected || isConnecting || !userIdToken) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(
        `ws://${backendRaw}/?token=${userIdToken}&room=${room}`
      );
      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        setRoomId(room);
        setWebSocket(ws);
      };
    } catch (err) {
      setError("Failed to create WebSocket connection");
      setWebSocket(null);
      setIsConnected(false);
      setRoomId("");
    } finally {
      setIsConnecting(false);
    }
  }

  function terminateWebSocket() {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
      setRoomId("");
      setError(null);
    }
  }

  function createNewRoom() {
    axiosApi({
      method: "GET",
      url: `/room/create`,
    })
      .then((response) => {
        const newRoomId = response.data;
        connectWebSocket(newRoomId);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  }

  return (
    <WebSocketContext.Provider
      value={{
        webSocket: webSocket,
        isConnected: isConnected,
        roomId: roomId,
        isConnecting: isConnecting,
        error: error,
        connectWebSocket: connectWebSocket,
        terminateWebSocket: terminateWebSocket,
        createNewRoom: createNewRoom,
        syncedData: syncedData,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
