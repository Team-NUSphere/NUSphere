import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);
import type { UserClassType } from "../contexts/timetableContext";
import ical, {
  ICalEventRepeatingFreq,
  type ICalEventData,
} from "ical-generator";

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(timezone);

type WeekRange = {
  start: string;
  end: string;
  weekInterval?: number;
  weeks?: number[];
};

type Lesson = {
  classNo: string;
  lessonType: string;
  weeks: number[] | WeekRange;
  day: keyof typeof dayMap;
  startTime: string; // "HHMM"
  endTime: string; // "HHMM"
  venue: string;
  modId: string;
};

// Semester Monday of Week 1
const SEMESTER_START = dayjs("2025-08-11");
const TIMEZONE = "Asia/Singapore";

const dayMap = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

function parseLessons(classes: UserClassType[]): Lesson[] {
  return classes.map((cls) => {
    if (!(cls.day in dayMap)) {
      throw new Error(`Invalid day: ${cls.day}`);
    }
    if (!cls.weeks && (!cls.startDate || !cls.endDate)) {
      throw new Error(`Missing weeks or date range for class: ${cls.moduleId}`);
    }
    return {
      classNo: cls.classNo,
      lessonType: cls.lessonType,
      day: cls.day,
      startTime: cls.startTime,
      endTime: cls.endTime,
      venue: cls.venue,
      modId: cls.moduleId,
      weeks:
        cls.startDate && cls.endDate
          ? {
              start: cls.startDate,
              end: cls.endDate,
              weekInterval: cls.weekInterval,
              weeks: cls.weeks,
            }
          : cls.weeks!,
    };
  });
}

function parseTime(timeStr: string): [number, number] {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`Invalid time values: ${timeStr}`);
  }
  return [hour, minute];
}

function generateEventDates(
  weeks: number[] | WeekRange,
  day: keyof typeof dayMap
): Dayjs[] {
  const dayIndex = dayMap[day];

  if (Array.isArray(weeks)) {
    return weeks.map((w) =>
      // Add number of weeks then move to the appropriate day
      SEMESTER_START.add(w - 1, "week").add(dayIndex, "day")
    );
  }

  const start = dayjs(weeks.start).day(dayIndex);
  const end = dayjs(weeks.end);
  const result: Dayjs[] = [];

  if (weeks.weeks) {
    for (const w of weeks.weeks) {
      result.push(
        dayjs(weeks.start)
          .add((w - 1) * 7, "day")
          .day(dayIndex)
      );
    }
  } else if (weeks.weekInterval) {
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      result.push(current);
      current = current.add(weeks.weekInterval, "week");
    }
  } else {
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      result.push(current);
      current = current.add(1, "week");
    }
  }

  return result;
}

export function handleDownload(classes: UserClassType[]) {
  const cal = ical({ name: "My Timetable", timezone: TIMEZONE });
  const timetable = parseLessons(classes);
  for (const lesson of timetable) {
    const dates = generateEventDates(lesson.weeks, lesson.day);
    if (dates.length === 0) continue;

    const [startHour, startMinute] = parseTime(lesson.startTime);
    const [endHour, endMinute] = parseTime(lesson.endTime);
    const first = dates[0];
    const last = dates[dates.length - 1];
    const weekSpan = last.diff(first, "week") + 1;

    const allDatesSet = new Set(dates.map((d) => d.format("YYYY-MM-DD")));
    const expectedDates = Array.from({ length: weekSpan }, (_, i) =>
      first.add(i, "week")
    );

    const exDates = expectedDates
      .filter((d) => !allDatesSet.has(d.format("YYYY-MM-DD")))
      .map((d) =>
        d.hour(startHour).minute(startMinute).second(0).millisecond(0).toDate()
      );

    console.log(exDates);
    cal.createEvent({
      start: first.hour(startHour).minute(startMinute).toDate(),
      end: first.hour(endHour).minute(endMinute).toDate(),
      summary: `${lesson.modId}: ${lesson.lessonType} (${lesson.classNo})`,
      location: lesson.venue,
      repeating: {
        freq: "WEEKLY" as ICalEventRepeatingFreq,
        count: weekSpan,
        exclude: exDates,
      },
    } as ICalEventData);
  }

  const blob = new Blob([cal.toString()], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "timetable.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
