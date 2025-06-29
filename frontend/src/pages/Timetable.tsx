import DayColumn from "../components/DayColumn";
import { format } from "date-fns";
import type { UserClassType } from "../contexts/timetableContext";
import { useState, useEffect } from "react";
import { getTimetableContext } from "../contexts/timetableContext";

export default function Timetable({
  startHour = 0,
  numOfHours = 24,
  classes = [],
}: 
{
  startHour: number;
  numOfHours: number;
  classes?: UserClassType[];
}) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = Array.from({ length: numOfHours }, (_, i) => i + startHour);

  const [selectedClass, setSelectedClass] = useState<UserClassType | null>(
    null
  );

  const { changeClass, getModuleClasses } = getTimetableContext();

  const [allModuleClasses, setAllModuleClasses] = useState<UserClassType[]>([]);
  useEffect(() => {
    const fetchModuleClasses = async () => {
      if (selectedClass) {
        const result = await getModuleClasses(
          selectedClass.moduleId,
          selectedClass.lessonType
        ).catch(() => []);
        console.log("selected"+result)
        setAllModuleClasses(result as UserClassType[]);
      } else {
        setAllModuleClasses([]);
      }
    };

    fetchModuleClasses();
  }, [selectedClass]);

  const handleClassClick = (userClass: UserClassType) => {
    if (selectedClass && selectedClass.classId === userClass.classId) {
      setSelectedClass(null);
    } else {
      setSelectedClass(userClass);
    }
  };

  const handleAlternativeClassClick = (alternativeClass: UserClassType) => {
    console.log(`Switching to alternative class`, alternativeClass);
    changeClass(
      alternativeClass.moduleId,
      alternativeClass.lessonType,
      alternativeClass.classNo
    );
    setSelectedClass(null);
  };

  useEffect(() => {
    if (selectedClass) {
      console.log("Selected class changed to:", selectedClass);
    }
  }, [selectedClass]);

  return (
    <div className="overflow-y-auto w-full h-full overflow-x-auto">
      <div className="flex flex-row w-full h-min">
        {/* Time column */}
        <div
          className="flex flex-col justify-between mt-10"
          style={{ height: `${numOfHours * 70}px` }}
        >
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
              startHour={startHour}
              classes={classes.filter(
                (event: UserClassType) =>
                  event.day.slice(0, 3).toUpperCase() === day
              )}
              selectedClass={selectedClass ?? undefined}
              allModuleClasses={allModuleClasses}
              onClassClick={handleClassClick}
              onAlternativeClassClick={handleAlternativeClassClick}
            ></DayColumn>
          ))}
        </ol>
      </div>
    </div>
  );
}
