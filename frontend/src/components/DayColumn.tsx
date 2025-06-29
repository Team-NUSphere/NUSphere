import clsx from "clsx";
import DayClass from "./DayClass";
import { differenceInMinutes, parse } from "date-fns";
import type { UserClassType } from "../contexts/timetableContext";
import detectOverlaps from "../functions/timetable_utils";
import { findAlternativeClasses } from "../functions/timetable_utils";
import { getTimetableContext } from "../contexts/timetableContext";
import { useEffect } from "react";

export default function DayColumn({
  classes,
  dayName,
  numOfHours,
  startHour,
  selectedClass,
  onClassClick,
  onAlternativeClassClick,
}: {
  classes: UserClassType[];
  dayName: string;
  numOfHours: number;
  startHour: number;
  selectedClass?: UserClassType;
  onClassClick?: (userClass: UserClassType) => void;
  onAlternativeClassClick?: (alternativeClass: UserClassType) => void;
}) {
  const numOfMinutes: number = numOfHours * 60;
  const baseDate = new Date();
  const baseTime = parse(
    `${startHour.toString().padStart(2, "0")}:00:00`,
    "HH:mm:ss",
    baseDate
  );

  const { getModuleClasses, moduleClasses } = getTimetableContext();
  
  useEffect(() => {
    if (selectedClass) {
      getModuleClasses(selectedClass.moduleId, selectedClass.lessonType);
      console.log(moduleClasses);
    }
  }, [selectedClass, getModuleClasses]);
  
  const alternativeClasses = selectedClass
    ? findAlternativeClasses(moduleClasses, classes, selectedClass)
    : [];

  const allClassesToShow = [...classes, ...alternativeClasses];

  const processedClasses = detectOverlaps(allClassesToShow, startHour);

  const maxOverlaps = Math.max(
    1,
    ...processedClasses.map((cls) => cls.totalColumns)
  );
  const minColumnWidth = Math.max(120, maxOverlaps * 80);

  return (
    <li
      className="flex flex-col flex-shrink-0"
      style={{ minWidth: `${minColumnWidth}px` }}
    >
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
          {processedClasses.map((lesson) => {
            const startTime = parse(lesson.startTime, "HH:mm:ss", baseDate);
            const endTime = parse(lesson.endTime, "HH:mm:ss", baseDate);
            const topPercentage =
              (differenceInMinutes(startTime, baseTime) * 100) / numOfMinutes;
            const heightPercentage =
              (differenceInMinutes(endTime, startTime) * 100) / numOfMinutes;
            const zIndex = Math.floor(topPercentage);

            const widthPercentage = 100 / lesson.totalColumns;
            const leftPercentage = (lesson.column * 100) / lesson.totalColumns;

            const isUserClass = classes.some(
              (cls) => cls.classId === lesson.classId
            );
            const isAlternative = !isUserClass;
            const isSelected = selectedClass === lesson;

            return (
              <DayClass
                key={lesson.classId}
                event={lesson}
                style={{
                  top: `${topPercentage}%`,
                  height: `${heightPercentage}%`,
                  left: `${leftPercentage}%`,
                  width: `${widthPercentage}%`,
                  zIndex: zIndex,
                }}
                onClick={() => {
                  if (isUserClass && onClassClick) {
                    onClassClick(lesson);
                  }
                }}
                onAlternativeClick={() => {
                  if (isAlternative && onAlternativeClassClick) {
                    onAlternativeClassClick(lesson);
                  }
                }}
                isSelected={isSelected}
                isAlternative={isAlternative}
              />
            );
          })}
        </div>
      </div>
    </li>
  );
}
