import DayColumn from "../components/DayColumn";
import type { UserClassType } from "../contexts/timetableContext";
import { useState, useEffect } from "react";
import { getTimetableContext } from "../contexts/timetableContext";
import { findAlternativeClasses } from "../functions/timetable_utils";

export default function Timetable({
  startHour = 0,
  numOfHours = 24,
  classes = [],
}: {
  startHour: number;
  numOfHours: number;
  classes: UserClassType[];
}) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = Array.from({ length: numOfHours }, (_, i) => i + startHour);

  const [selectedClass, setSelectedClass] = useState<UserClassType | null>(
    null
  );

  const { changeClass, getModuleClasses } = getTimetableContext();

  const [alternativeClasses, setAlternativeClasses] = useState<UserClassType[]>(
    []
  );
  const [allClassesToShow, setAllClassesToShow] = useState<UserClassType[]>([
    ...classes.map((cls) => ({ ...cls, chosen: true })),
    ...alternativeClasses.map((cls) => ({
      ...cls,
      chosen: false,
    })),
  ]);

  useEffect(() => {
    console.log("Classes:", classes);
    setAllClassesToShow([
      ...classes.map((cls) => ({ ...cls, chosen: true })),
      ...alternativeClasses.map((cls) => ({
        ...cls,
        chosen: false,
      })),
    ]);
  }, [classes, alternativeClasses]);

  useEffect(() => {
    const fetchModuleClasses = async () => {
      if (selectedClass) {
        try {
          const result = await getModuleClasses(
            selectedClass.moduleId,
            selectedClass.lessonType
          );
          console.log("Fetched module classes:", result);
          setAlternativeClasses(
            findAlternativeClasses(
              result as UserClassType[],
              classes,
              selectedClass
            )
          );
        } catch (error) {
          console.error("Error fetching module classes:", error);
          setAlternativeClasses([]);
        }
      } else {
        setAlternativeClasses([]);
        setAllClassesToShow(classes);
      }
    };
    (async () => await fetchModuleClasses())();
  }, [selectedClass]);

  const handleClassClick = (userClass: UserClassType) => {
    if (selectedClass && selectedClass.classId === userClass.classId) {
      setSelectedClass(null);
    } else {
      setSelectedClass(userClass);
    }
  };

  const handleAlternativeClassClick = async (
    alternativeClass: UserClassType
  ) => {
    console.log(`Switching to alternative class`, alternativeClass);
    await changeClass(
      alternativeClass.moduleId,
      alternativeClass.lessonType,
      alternativeClass.classNo
    );
    setSelectedClass(null);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  return (
    <div className="overflow-y-auto w-full h-full overflow-x-auto ">
      <div className="flex flex-row w-full h-min">
        {/* Time column */}
        <div
          className="flex flex-col justify-between mt-10"
          style={{ height: `${numOfHours * 60}px` }}
        >
          {hours.map((hour) => (
            <div key={hour} className="text-right -translate-y-1/2 p-2">
              {formatHour(hour)}
            </div>
          ))}
          <div></div>
        </div>
        {/* Timetable grid */}
        <div className="border border-gray-300 rounded-lg flex flex-row flex-grow flex-shrink-0 basis-auto divide-x divide-gray-300">
          {daysOfWeek.map((day) => (
            <DayColumn
              key={day}
              dayName={day}
              numOfHours={numOfHours}
              startHour={startHour}
              allClassesToShow={allClassesToShow.filter(
                (event: UserClassType) =>
                  event.day.slice(0, 3).toUpperCase() === day
              )}
              selectedClass={selectedClass ?? undefined}
              onClassClick={handleClassClick}
              onAlternativeClassClick={handleAlternativeClassClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
