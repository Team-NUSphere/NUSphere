import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { getWebSocketContext } from "../contexts/webSocketContext";
import { getTimetableContext } from "../contexts/timetableContext";
import type { UserClassType } from "../contexts/timetableContext";
import CollaboratorsSection from "../components/CollaboratorsSection";
import {
  detectCollaborativeOverlaps,
  findCollaborativeAlternativeClasses,
  type CollaborativeClassType,
} from "../functions/timetable_utils";

// Color palette for different collaborators
const COLLABORATOR_COLORS = [
  "#CC5500", // orange
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#84cc16", // lime
];

interface ModuleInfo {
  moduleId: string;
  title: string;
  faculty: string;
  moduleCredit: number;
}

interface CollaboratorData {
  userId: string;
  moduleCount: number;
  color: string;
  modules: ModuleInfo[];
}

export default function CollaborateTimetable() {
  const { syncedData } = getWebSocketContext();
  const { userClasses, userModules, changeClass, getModuleClasses } =
    getTimetableContext();
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([
    "You",
  ]);
  const [selectedClass, setSelectedClass] = useState<UserClassType | null>(
    null
  );
  const [alternativeClasses, setAlternativeClasses] = useState<UserClassType[]>(
    []
  );
  const [isChangingClass, setIsChangingClass] = useState(false);

  // Prepare collaborator data with colors and modules
  const collaborators = useMemo(() => {
    const collabs: CollaboratorData[] = [];

    const allModules: ModuleInfo[] = Object.values(userModules);
    collabs.push({
      userId: "You",
      moduleCount: allModules.length,
      color: COLLABORATOR_COLORS[0],
      modules: allModules,
    });

    if (syncedData) {
      Object.entries(syncedData).forEach(([userId, userData], index) => {
        const collaboratorModules: ModuleInfo[] = userData.modules
          ? Object.values(userData.modules)
          : [];
        collabs.push({
          userId,
          moduleCount: collaboratorModules.length,
          color: COLLABORATOR_COLORS[(index + 1) % COLLABORATOR_COLORS.length],
          modules: collaboratorModules,
        });
      });
    }

    return collabs;
  }, [syncedData, userModules]);

  // Prepare all classes with collaborator info
  const allClasses = useMemo(() => {
    const classes: CollaborativeClassType[] = [];

    if (selectedCollaborators.includes("You")) {
      userClasses.forEach((cls) => {
        classes.push({
          ...cls,
          collaboratorId: "You",
          color: COLLABORATOR_COLORS[0],
          chosen: true,
        });
      });
    }

    if (syncedData) {
      Object.entries(syncedData).forEach(([userId, userData], index) => {
        if (selectedCollaborators.includes(userId) && userData.classes) {
          console.log("Collaborate Timetable Error");
          console.log(`Adding classes for collaborator ${userId}`);
          console.log("User classes:", userData.classes);
          userData.classes.forEach((cls) => {
            classes.push({
              ...cls,
              collaboratorId: userId,
              color:
                COLLABORATOR_COLORS[(index + 1) % COLLABORATOR_COLORS.length],
              chosen: true,
            });
          });
        }
      });
    }

    return classes;
  }, [syncedData, userClasses, selectedCollaborators]);

  const allClassesToShow = useMemo(() => {
    const classes = [...allClasses];

    if (!isChangingClass && alternativeClasses.length > 0) {
      alternativeClasses.forEach((cls) => {
        classes.push({
          ...cls,
          collaboratorId: "You",
          color: COLLABORATOR_COLORS[0],
          chosen: false,
        });
      });
    }

    return classes;
  }, [allClasses, alternativeClasses, isChangingClass]);

  const handleToggleCollaborator = (userId: string) => {
    setSelectedCollaborators((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(() => {
    if (isChangingClass) {
      setIsChangingClass(false);
      setAlternativeClasses([]);
      setSelectedClass(null);
    }
  }, [userClasses, isChangingClass]);

  useEffect(() => {
    const fetchModuleClasses = async () => {
      if (selectedClass && !isChangingClass) {
        try {
          const result = await getModuleClasses(
            selectedClass.moduleId,
            selectedClass.lessonType
          );
          console.log("Fetched module classes:", result);

          const userOnlyClasses = allClasses.filter(
            (cls) => cls.collaboratorId === "You"
          );
          setAlternativeClasses(
            findCollaborativeAlternativeClasses(
              result as UserClassType[],
              userOnlyClasses,
              selectedClass
            )
          );
        } catch (error) {
          console.error("Error fetching module classes:", error);
          setAlternativeClasses([]);
        }
      } else {
        setAlternativeClasses([]);
      }
    };
    fetchModuleClasses();
  }, [selectedClass, allClasses, isChangingClass]);

  const handleClassClick = (userClass: CollaborativeClassType) => {
    if (
      userClass.collaboratorId !== "You" ||
      !userClass.chosen ||
      isChangingClass
    )
      return;

    if (selectedClass && selectedClass.classId === userClass.classId) {
      setSelectedClass(null);
    } else {
      setSelectedClass(userClass);
    }
  };

  const handleAlternativeClassClick = async (
    alternativeClass: UserClassType
  ) => {
    if (isChangingClass) return;

    console.log(`Switching to alternative class`, alternativeClass);

    setIsChangingClass(true);

    try {
      await changeClass(
        alternativeClass.moduleId,
        alternativeClass.lessonType,
        alternativeClass.classNo
      );
      console.log("Class change completed successfully");
    } catch (error) {
      console.error("Error changing class:", error);
      setIsChangingClass(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden">
        <CollaborativeTimetable
          startHour={8}
          numOfHours={14}
          classes={allClassesToShow}
          selectedClass={selectedClass}
          onClassClick={handleClassClick}
          onAlternativeClassClick={handleAlternativeClassClick}
          isChangingClass={isChangingClass}
        />
      </div>
      <div className="shrink-0">
        <CollaboratorsSection
          collaborators={collaborators}
          selectedCollaborators={selectedCollaborators}
          onToggleCollaborator={handleToggleCollaborator}
        />
      </div>
    </div>
  );
}

function CollaborativeTimetable({
  startHour = 0,
  numOfHours = 24,
  classes = [],
  selectedClass,
  onClassClick,
  onAlternativeClassClick,
  isChangingClass = false,
}: {
  startHour: number;
  numOfHours: number;
  classes: CollaborativeClassType[];
  selectedClass?: UserClassType | null;
  onClassClick?: (userClass: CollaborativeClassType) => void;
  onAlternativeClassClick?: (alternativeClass: UserClassType) => void;
  isChangingClass?: boolean;
}) {
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = Array.from({ length: numOfHours }, (_, i) => i + startHour);

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  return (
    <div className="overflow-y-auto w-full h-full overflow-x-auto">
      <div className="flex flex-row w-full h-min">
        <div
          className="flex flex-col justify-between mt-10"
          style={{ height: `${numOfHours * 70}px` }}
        >
          {hours.map((hour) => (
            <div key={hour} className="text-right -translate-y-1/2 p-2">
              {formatHour(hour)}
            </div>
          ))}
          <div></div>
        </div>

        <div className="border border-gray-300 rounded-lg flex flex-row flex-grow flex-shrink-0 basis-auto divide-x divide-gray-300">
          {daysOfWeek.map((day) => (
            <CollaborativeDayColumn
              key={day}
              dayName={day}
              numOfHours={numOfHours}
              startHour={startHour}
              classes={classes.filter(
                (cls) => cls.day.slice(0, 3).toUpperCase() === day
              )}
              selectedClass={selectedClass}
              onClassClick={onClassClick}
              onAlternativeClassClick={onAlternativeClassClick}
              isChangingClass={isChangingClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollaborativeDayColumn({
  dayName,
  numOfHours,
  startHour,
  classes,
  selectedClass,
  onClassClick,
  onAlternativeClassClick,
  isChangingClass = false,
}: {
  dayName: string;
  numOfHours: number;
  startHour: number;
  classes: CollaborativeClassType[];
  selectedClass?: UserClassType | null;
  onClassClick?: (userClass: CollaborativeClassType) => void;
  onAlternativeClassClick?: (alternativeClass: UserClassType) => void;
  isChangingClass?: boolean;
}) {
  const numOfMinutes: number = numOfHours * 60;
  const baseDate = new Date();
  const baseTime = new Date(baseDate);
  baseTime.setHours(startHour, 0, 0, 0);

  const processedClasses = useMemo(() => {
    return detectCollaborativeOverlaps(classes, startHour);
  }, [classes, startHour]);

  const maxOverlaps = Math.max(
    1,
    ...processedClasses.map((cls) => cls.totalColumns || 1)
  );
  const minColumnWidth = Math.max(150, maxOverlaps * 80);

  return (
    <div
      className="flex flex-col flex-grow"
      style={{ minWidth: `${minColumnWidth}px` }}
    >
      <div className="h-10 p-2 text-center sticky top-0 bg-white/70 rounded-lg z-50">
        {dayName}
      </div>

      <div
        className={`flex-grow basis-auto bg-gradient-to-b from-blue-50 via-blue-50 to-white ${
          dayName === "MON" ? "rounded-bl-lg" : ""
        } ${dayName === "FRI" ? "rounded-br-lg" : ""}`}
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${
            100 / numOfHours - 0.1
          }%, #e5e7eb ${100 / numOfHours}%)`,
        }}
      >
        <div className="relative h-full">
          {processedClasses.map((lesson) => {
            const startTime = new Date(baseDate);
            const [startHour, startMin] = lesson.startTime
              .split(":")
              .map(Number);
            startTime.setHours(startHour, startMin, 0, 0);

            const endTime = new Date(baseDate);
            const [endHour, endMin] = lesson.endTime.split(":").map(Number);
            endTime.setHours(endHour, endMin, 0, 0);

            const topPercentage =
              (((startTime.getTime() - baseTime.getTime()) / (1000 * 60)) *
                100) /
              numOfMinutes;
            const heightPercentage =
              (((endTime.getTime() - startTime.getTime()) / (1000 * 60)) *
                100) /
              numOfMinutes;
            const zIndex = Math.floor(topPercentage);

            const widthPercentage = 100 / (lesson.totalColumns || 1);
            const leftPercentage =
              ((lesson.column || 0) * 100) / (lesson.totalColumns || 1);

            const isUserClass =
              lesson.chosen && lesson.collaboratorId === "You";
            const isAlternative =
              !lesson.chosen && lesson.collaboratorId === "You";
            const isSelected =
              selectedClass && selectedClass.classId === lesson.classId;

            return (
              <CollaborativeClassBlock
                key={`${lesson.classId}-${lesson.collaboratorId}`}
                lesson={lesson}
                style={{
                  top: `${topPercentage}%`,
                  height: `${heightPercentage}%`,
                  left: `${leftPercentage}%`,
                  width: `${widthPercentage}%`,
                  zIndex: zIndex,
                }}
                onClick={() => {
                  if (isUserClass && onClassClick && !isChangingClass) {
                    onClassClick(lesson);
                  }
                }}
                onAlternativeClick={() => {
                  if (
                    isAlternative &&
                    onAlternativeClassClick &&
                    !isChangingClass
                  ) {
                    onAlternativeClassClick(lesson);
                  }
                }}
                isSelected={!!isSelected}
                isAlternative={isAlternative}
                isClickable={isUserClass && !isChangingClass}
                isChangingClass={isChangingClass}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CollaborativeClassBlock({
  lesson,
  style,
  onClick,
  onAlternativeClick,
  isSelected = false,
  isAlternative = false,
  isClickable = false,
  isChangingClass = false,
}: {
  lesson: CollaborativeClassType;
  style?: React.CSSProperties;
  onClick?: () => void;
  onAlternativeClick?: () => void;
  isSelected?: boolean;
  isAlternative?: boolean;
  isClickable?: boolean;
  isChangingClass?: boolean;
}) {
  const handleClick = () => {
    if (isChangingClass) return;

    if (isAlternative && onAlternativeClick) {
      onAlternativeClick();
    } else if (onClick && isClickable) {
      onClick();
    }
  };

  return (
    <div
      className={`absolute rounded-md px-2 py-1 text-xs shadow-sm border-2 transition-all duration-400 ease-out select-none ${
        isChangingClass
          ? "opacity-50 cursor-not-allowed"
          : isAlternative
          ? "opacity-60 hover:opacity-80 z-50 cursor-pointer"
          : isSelected
          ? "z-40"
          : isClickable
          ? "hover:opacity-90 z-30 cursor-pointer"
          : "z-30"
      }`}
      style={{
        ...style,
        backgroundColor: isAlternative ? "#fed7aa" : lesson.color + "40",
        borderColor: isAlternative
          ? "#fb923c"
          : isSelected
          ? "#fb923c"
          : lesson.color,
        margin: "2px",
        width: style?.width ? `calc(${style.width} - 4px)` : undefined,
        minWidth: "70px",
      }}
      onClick={handleClick}
    >
      <div className="font-semibold truncate">{lesson.moduleId}</div>
      <div className="text-gray-700 truncate">
        {lesson.lessonType} [{lesson.classNo}]
      </div>
      <div className="text-gray-600 truncate text-xs">{lesson.venue}</div>
      <div className="text-xs font-medium mt-1" style={{ color: lesson.color }}>
        {lesson.collaboratorId.slice(0, 8)}
      </div>
      {isChangingClass && isAlternative && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-md">
          <div className="text-xs text-white font-medium">Changing...</div>
        </div>
      )}
    </div>
  );
}
