import clsx from "clsx";
import DayClass from "./DayClass";
import { differenceInMinutes, parse } from "date-fns";
import type { UserClassType } from "../contexts/timetableContext";

export default function DayColumn({
  classes,
  dayName,
  numOfHours,
  startHour,
}: {
  classes: UserClassType[];
  dayName: string;
  numOfHours: number;
  startHour: number;
}) {
  const numOfMinutes: number = numOfHours * 60;
  const baseDate = new Date();
  const baseTime = parse(
    `${startHour.toString().padStart(2, "0")}:00:00`,
    "HH:mm:ss",
    baseDate
  );

  return (
    <li className="flex flex-col flex-grow-1 flex-shrink-0 basis-auto">
      {/* Day header */}
      <div className="h-10 p-2 text-center sticky top-0 bg-white/70 rounded-lg z-100">
        {dayName}
      </div>
      {/* Event grid */}
      <div
        className={clsx(
          "flex-grow basis-auto bg-[image:linear-gradient(to_bottom,#eff6ff_0%,#eff6ff_50%,white_50%,white_100%)]",
          {
            "rounded-bl-lg": dayName === "MON",
            "rounded-br-lg": dayName === "FRI",
          }
        )}
        style={{
          backgroundSize: `20% ${200 / numOfHours}%`,
        }}
      >
        <div className="relative h-full">
          {classes.map((lesson) => {
            const startTime = parse(lesson.startTime, "HH:mm:ss", baseDate);
            const endTime = parse(lesson.endTime, "HH:mm:ss", baseDate);
            const topPercentage =
              (differenceInMinutes(startTime, baseTime) * 100) / numOfMinutes;
            const heightPercentage =
              (differenceInMinutes(endTime, startTime) * 100) / numOfMinutes;
            const zIndex = topPercentage;

            return (
              <DayClass
                key={lesson.classId}
                event={lesson}
                style={{
                  top: `${topPercentage}%`,
                  height: `${heightPercentage}%`,
                  zIndex: zIndex,
                }}
              />
            );
          })}
        </div>
      </div>
    </li>
  );
}
