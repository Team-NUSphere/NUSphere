import { createEvents, type EventAttributes } from "ics";
import { saveAs } from "file-saver";
import type {
  UserClassType,
  UserEventType,
} from "../contexts/timetableContext";

const generateEventsFromWeeks = (
  userEvent: UserEventType,
  weeks: number[],
  formattedEvents: EventAttributes[]
) => {};

const handleFormatUserEvents = (userEvents: UserEventType[]) => {
  const formattedEvents: EventAttributes[] = [];
  for (const userEvent of userEvents) {
    if (userEvent.weeks) {
      generateEventsFromWeeks(userEvent, userEvent.weeks, formattedEvents);
    } else {
      formattedEvents.push();
    }
  }
};

//     start: DateTime;
//     startInputType?: "local" | "utc";
//     startOutputType?: "local" | "utc";
//     endInputType?: "local" | "utc";
//     endOutputType?: "local" | "utc";
//     title?: string;
//     description?: string;
//     location?: string;
//     geo?: GeoCoordinates;
//     url?: string;
//     status?: EventStatus;
//     busyStatus?: "FREE" | "BUSY" | "TENTATIVE" | "OOF";
//     transp?: "TRANSPARENT" | "OPAQUE";
//     organizer?: Person & {
//         sentBy?: string;
//     };
//     attendees?: Attendee[];

const handleFormatUserClasses = (userClasses: UserClassType[]) => {};

const handleExportEvents = (events: EventAttributes[]) => {
  createEvents(events, (err, val) => {
    if (err) {
      console.error(err);
      return;
    }
    const blob = new Blob([val], {
      type: "text/calendar;charset=utf-8",
    });
    saveAs(blob, "timetable.ics");
  });
};
