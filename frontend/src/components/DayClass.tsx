import React from "react";
import type { UserClassType } from "../contexts/timetableContext";

export default function DayClass({
  event,
  style,
}: {
  event: UserClassType;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute left-1 right-1 rounded-md px-2 py-1 text-ellipsis bg-orange-300 shadow-sm hover:bg-orange-500 cursor-pointer transition-colors duration-400 ease-out select-none"
      style={style}
    >
      <div className="font-semibold text-sm">{event.moduleId}</div>
      <div className="">
        <span className="text-gray-600 text-xs">{`${event.lessonType} [${event.classNo}]`}</span>
      </div>
      <div className="text-gray-600 text-xs">{event.venue}</div>
    </div>
  );
}
