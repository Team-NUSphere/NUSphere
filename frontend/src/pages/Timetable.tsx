import { useState } from "react";
import DayColumn from "../components/DayColumn";
import { format } from "date-fns";
import type { UserEventType } from "../contexts/timetableContext";

export default function Timetable({
  startHour = 0,
  numOfHours = 24,
}: {
  startHour: number;
  numOfHours: number;
}) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = Array.from({ length: numOfHours }, (_, i) => i + startHour);
  return (
    <div className="overflow-y-scroll w-full">
      <div className="flex flex-row w-full h-min">
        {/* Time column */}
        <div className="flex flex-col justify-between mt-10">
          {hours.map((hour) => (
            <div key={hour} className="text-right -translate-y-1/2 p-2">
              {format(new Date(2000, 0, 1, hour, 0), "ha")}
            </div>
          ))}
          <div></div>
          {/* Timetable grid */}
        </div>
        <ol className="border-1 border-gray-300 rounded-lg flex flex-row flex-grow flex-shrink-0 basis-auto divide-x-1 divide-solid divide-gray-300">
          {daysOfWeek.map((day) => (
            <DayColumn
              key={day}
              dayName={day}
              numOfHours={numOfHours}
            ></DayColumn>
          ))}
        </ol>
      </div>
    </div>
  );
}
