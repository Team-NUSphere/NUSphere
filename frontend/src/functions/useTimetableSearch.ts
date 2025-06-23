import axios from "axios";
import { useEffect, useState } from "react";
import { backendHttp } from "../constants";
import type { User } from "firebase/auth";

type Event = {
  title: string;
  description?: string;
  venue?: string;
  weeks?: number[];
  startTime: string;
  endTime: string;
};

type Class = {
  moduleCode: string;
  day: string;
  lessonType: string;
  classNo: string;
  venue: string;
  weeks?: number[];
  startTime: string;
  endTime: string;
};

export default async function useTimetableSearch(
  path: string,
  user: User | null = null
) {
  const [events, setEvents] = useState<(Event | Class)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const userIdToken = await user?.getIdToken();

  useEffect(() => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const signal = controller.signal;

    axios({
      method: "GET",
      url: `${backendHttp}${path}`,
      headers: {
        "Content-Type": "application/json",
        ...(userIdToken ? { Authorization: `Bearer ${userIdToken}` } : {}),
      },
      signal: signal,
    })
      .then((res) => {
        const { backendEvents, backendClasses } = res.data;
        const mappedEvents = backendEvents.map(
          (backendEvent: any) =>
            ({
              title: backendEvent.name,
              description: backendEvent.description,
              startTime: backendEvent.startTime,
              endTime: backendEvent.endTime,
            } as Event)
        );
        const mappedClasses = backendClasses.map(
          (backendClass: any) =>
            ({
              moduleCode: backendClass.moduleId,
              day: backendClass.day,
              lessonType: backendClass.lessonType,
              classNo: backendClass.classNo,
              venue: backendClass.venue,
              weeks: backendClass.weeks,
              startTime: backendClass.startTime,
              endTime: backendClass.endTime,
            } as Class)
        );

        setEvents([...mappedEvents, ...mappedClasses]);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        }
        console.error(e);
        setError(true);
        setLoading(false);
      });
  }, []);

  return { loading, error, events, setEvents };
}
