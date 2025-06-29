import React from "react";
import type { UserClassType } from "../contexts/timetableContext";

export default function DayClass({
  event,
  style,
  onClick,
  isSelected = false,
  isAlternative = false,
  onAlternativeClick,
}: {
  event: UserClassType;
  style?: React.CSSProperties;
  onClick?: () => void
  isSelected?: boolean
  isAlternative?: boolean
  onAlternativeClick?: () => void
}) {

  const handleClick = () => {
    console.log("Clicked on class:", event.classId, event.moduleId);
    console.log("isSelected:", isSelected);
    console.log("isAlternative:", isAlternative);
    if (isAlternative && onAlternativeClick) {
      onAlternativeClick()
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div
      className={`absolute rounded-md px-3 py-2 text-ellipsis shadow-sm cursor-pointer transition-all duration-400 ease-out select-none border ${
        isAlternative
          ? "bg-orange-200 border-orange-300 opacity-60 hover:opacity-80 z-50"
          : isSelected
            ? "bg-orange-400 border-orange-500 z-40"
            : "bg-orange-300 border-orange-400 hover:bg-orange-500 z-30"
      }`}
      style={{
        ...style,
        margin: "2px",
        width: style?.width ? `calc(${style.width} - 4px)` : undefined,
        minWidth: "70px", 
      }}
      onClick={handleClick}
    >
      <div className="font-semibold text-sm">{event.moduleId}</div>
      <div className="">
        <span className="text-gray-600 text-xs">{`${event.lessonType} [${event.classNo}]`}</span>
      </div>
      <div className="text-gray-600 text-xs">{event.venue}</div>
    </div>
  );
}
