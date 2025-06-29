import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getAuth } from "./authContext";
import axios from "axios";
import axiosApi from "../functions/axiosApi";

export type modInfo = {
  moduleId: string;
  title: string;
  faculty: string;
  moduleCredit: number;
};
export type UserModulesType = Record<string, modInfo>;

export type UserEventType = {
  description?: string;
  endTime: string;
  eventId: string;
  name: string;
  startTime?: string;
  venue?: string;
  weeks?: number[];
  day: string;
};
export type UserEventsType = Record<string, UserEventType>;

export type UserClassType = {
  classNo: string;
  day: string;
  endTime: string;
  classId: number;
  lessonType: string;
  startTime: string;
  venue: string;
  weeks?: number[];
  startDate?: string;
  endDate?: string;
  weekInterval?: number;
  moduleId: string;
  chosen?: boolean;
};

export function getTimetableContext(): TimetableContextType {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error("Must pass in context provider for authContext");
  }
  return context;
}

interface TimetableContextType {
  userClasses: UserClassType[];
  userEvents: UserEventsType;
  userModules: UserModulesType;
  getModules: () => (reason?: any) => void;
  registerModule: (mod: modInfo) => Promise<(reason?: any) => void>;
  removeModule: (moduleCode: string) => Promise<(reason?: any) => void>;
  changeClass: (
    moduleCode: string,
    lessonType: string,
    classNo: string
  ) => Promise<(reason?: any) => void>;
  getEvents: () => (reason?: any) => void;
  modifyEvent: (event: UserEventType) => Promise<(reason?: any) => void>;
  addEvent: (event: UserEventType) => Promise<(reason?: any) => void>;
  deleteEvent: (eventId: string) => Promise<(reason?: any) => void>;
  getModuleClasses: (
    moduleCode: string,
    lessonType: string
  ) => Promise<UserClassType[]>;
}

const TimetableContext = createContext<TimetableContextType | undefined>(
  undefined
);

// AuthProvider definition
interface TimetableProviderProps {
  children: ReactNode;
}

export function TimetableProvider({ children }: TimetableProviderProps) {
  const { userIdToken, isAuthenticated } = getAuth();
  const [userClasses, setUserClasses] = useState<UserClassType[]>([]);
  const [userEvents, setUserEvents] = useState<UserEventsType>({});
  const [userModules, setUserModules] = useState<UserModulesType>({});

  // getModules -> get req, backend return list of modules with list of selected classes
  function getModules() {
    if (!userIdToken) return () => {};

    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "GET",
      url: "/userTimetable/modules",
      headers: {
        "Content-Type": "application/json",
      },
      signal: signal,
    })
      .then((res) => {
        setUserModules(
          Object.fromEntries(
            res.data.modules.map((mod: modInfo) => [mod.moduleId, mod])
          )
        );
        setUserClasses(res.data.classes);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        } else {
          console.error(e);
        }
      });

    return () => controller.abort();
  }

  // registerModule -> send post req, backend return list of default classes
  async function registerModule(mod: modInfo) {
    if (!userIdToken || mod.moduleId in userEvents) return () => {};
    setUserModules((prev) => ({
      ...prev,
      [mod.moduleId]: mod,
    }));

    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "POST",
      url: `/userTimetable/modules/${mod.moduleId}`,
      headers: {
        "Content-Type": "application/json",
      },
      signal: signal,
    })
      .then((res) => {
        setUserClasses((prev) => [...prev, ...res.data]);
        console.log(userClasses);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        } else {
          console.error(e);
        }
      });

    return controller.abort;
  }

  async function getModuleClasses(
    moduleCode: string,
    lessonType: string
  ): Promise<UserClassType[]> {
    if (!userIdToken) return [];
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const data = await axiosApi({
        method: "GET",
        url: `/userTimetable/modules/${moduleCode}/classes/${lessonType}`,
        headers: {
          "Content-Type": "application/json",
        },
        signal: signal,
      });
      return data.data as UserClassType[];
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("Request cancelled: " + e.message);
      } else {
        console.error(e);
      }
      return [];
    }
  }

  // removeModule -> send del req -> backend send status code
  async function removeModule(moduleCode: string) {
    if (!userIdToken) return () => {};
    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "DELETE",
      url: `/userTimetable/modules/${moduleCode}`,
      headers: {
        "Content-Type": "application/json",
      },
      signal: signal,
    }).catch((e) => {
      if (axios.isCancel(e)) {
        console.log("Request cancelled: " + e.message);
      } else {
        console.error(e);
      }
    });
    setUserClasses((prev) =>
      prev.filter((lesson) => lesson.moduleId !== moduleCode)
    );
    setUserModules((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== moduleCode)
      )
    );

    return controller.abort;
  }

  // changeClass ->
  // create change in module's selected classes, put req,
  // backend return newly selected Class objects, delete the changed class in Classes,
  // add in the returned Class objects
  async function changeClass(
    moduleCode: string,
    lessonType: string,
    classNo: string
  ) {
    console.log(
      `Changing class for module ${moduleCode}, lessonType ${lessonType}, classNo ${classNo}`
    );
    if (!userIdToken) return () => {};
    setUserClasses((prev) =>
      prev.filter(
        (lesson) =>
          !(lesson.moduleId === moduleCode && lesson.lessonType === lessonType)
      )
    );
    console.log(userClasses);
    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "PATCH",
      url: `/userTimetable/modules/${moduleCode}`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        lessonType: lessonType,
        classNo: classNo,
      },
      signal: signal,
    })
      .then((res) => {
        setUserClasses((prev) => [...prev, ...(res.data as UserClassType[])]);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        } else {
          console.error(e);
        }
      });

    return () => controller.abort();
  }

  // function getEvents -> get req, backend return list of Events
  function getEvents() {
    if (!userIdToken) return () => {};
    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "GET",
      url: "/userTimetable/events",
      headers: {
        "Content-Type": "application/json",
      },
      signal: signal,
    })
      .then((res) => {
        setUserEvents(res.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        } else {
          console.error(e);
        }
      });

    return () => controller.abort;
  }

  // function modifyEvent -> put req(full event information), backend send status code, retry until 200
  async function modifyEvent(event: UserEventType) {
    if (!userIdToken) return () => {};
    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "PUT",
      url: `/userTimetable/events`,
      headers: {
        "Content-Type": "application/json",
      },
      data: event,
      signal: signal,
    }).catch((e) => {
      if (axios.isCancel(e)) {
        console.log("Request cancelled: " + e.message);
      } else {
        console.error(e);
      }
    });
    const oldEvent = userEvents[event.eventId];
    setUserEvents((prev) => ({
      ...prev,
      [event.eventId]: { ...oldEvent, ...event },
    }));

    return controller.abort;
  }

  // function addEvent -> send post req, backend send status code
  async function addEvent(event: UserEventType) {
    if (!userIdToken) return () => {};
    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "POST",
      url: "/userTimetable/events",
      headers: {
        "Content-Type": "application/json",
      },
      data: event,
      signal: signal,
    }).catch((e) => {
      if (axios.isCancel(e)) {
        console.log("Request cancelled: " + e.message);
      } else {
        console.error(e);
      }
    });
    setUserEvents((prev) => ({
      ...prev,
      [event.eventId]: event,
    }));

    return controller.abort;
  }

  // function deleteEvent -> send del req, backend send status code
  async function deleteEvent(eventId: string) {
    if (!userIdToken) return () => {};
    const controller = new AbortController();
    const signal = controller.signal;
    axiosApi({
      method: "DELETE",
      url: `/userTimetable/events`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        eventId: eventId,
      },
      signal: signal,
    }).catch((e) => {
      if (axios.isCancel(e)) {
        console.log("Request cancelled: " + e.message);
      } else {
        console.error(e);
      }
    });
    setUserEvents((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== eventId)
      )
    );
    return controller.abort;
  }

  // update UserClasses, Modules and Events automatically on login
  useEffect(() => {
    if (isAuthenticated && userIdToken) {
      const unsubModules = getModules();
      const unsubEvents = getEvents();
      return () => {
        unsubModules();
        unsubEvents();
      };
    }
    return () => {};
  }, [isAuthenticated, userIdToken]);

  return (
    <TimetableContext.Provider
      value={{
        userClasses: userClasses,
        userEvents: userEvents,
        userModules: userModules,
        getModules: getModules,
        registerModule: registerModule,
        removeModule: removeModule,
        changeClass: changeClass,
        getEvents: getEvents,
        modifyEvent: modifyEvent,
        addEvent: addEvent,
        deleteEvent: deleteEvent,
        getModuleClasses: getModuleClasses,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}
