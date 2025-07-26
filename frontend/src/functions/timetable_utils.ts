import type { UserClassType } from "../contexts/timetableContext";
import { differenceInMinutes, parse } from "date-fns";

// Helper function to detect overlapping classes
export default function detectOverlaps(
  classes: UserClassType[],
  startHour: number
) {
  const baseDate = new Date();
  const baseTime = parse(
    `${startHour.toString().padStart(2, "0")}:00:00`,
    "HH:mm:ss",
    baseDate
  );

  const classesWithTimes = classes
    .map((lesson) => {
      const startTime = parse(lesson.startTime, "HH:mm:ss", baseDate);
      const endTime = parse(lesson.endTime, "HH:mm:ss", baseDate);
      const startMinutes = differenceInMinutes(startTime, baseTime);
      const endMinutes = differenceInMinutes(endTime, baseTime);

      return {
        ...lesson,
        startMinutes,
        endMinutes,
        column: 0,
        totalColumns: 1,
      };
    })
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const processedClasses = [];

  for (let i = 0; i < classesWithTimes.length; i++) {
    const currentClass = classesWithTimes[i];
    const overlappingClasses = [currentClass];

    for (let j = i + 1; j < classesWithTimes.length; j++) {
      const otherClass = classesWithTimes[j];

      if (otherClass.startMinutes < currentClass.endMinutes) {
        overlappingClasses.push(otherClass);
      } else {
        break;
      }
    }

    overlappingClasses.forEach((cls, index) => {
      cls.column = index;
      cls.totalColumns = overlappingClasses.length;
    });

    processedClasses.push(...overlappingClasses);
    i += overlappingClasses.length - 1;
  }

  return processedClasses;
}

export const findAlternativeClasses = (
  allFilteredClasses: UserClassType[],
  currentUserClasses: UserClassType[],
  selectedClass: UserClassType
): UserClassType[] => {
  return allFilteredClasses.filter(
    (cls) =>
      cls.classId !== selectedClass.classId &&
      !currentUserClasses.some((userCls) => userCls.classId === cls.classId)
  );
};

export type CollaborativeClassType = UserClassType & {
  collaboratorId: string;
  collaboratorName: string;
  color: string;
  chosen?: boolean;
  totalColumns?: number;
  column?: number;
};

// Helper function to detect overlapping classes in collaboration
export function detectCollaborativeOverlaps(
  classes: CollaborativeClassType[],
  _startHour: number
): CollaborativeClassType[] {
  if (classes.length === 0) return [];

  // Group classes by day
  const classesByDay: { [day: string]: CollaborativeClassType[] } = {};

  classes.forEach((cls) => {
    const day = cls.day.slice(0, 3).toUpperCase();
    if (!classesByDay[day]) {
      classesByDay[day] = [];
    }
    classesByDay[day].push(cls);
  });

  const processedClasses: CollaborativeClassType[] = [];

  Object.values(classesByDay).forEach((dayClasses) => {
    const sortedClasses = dayClasses.sort((a, b) => {
      const aStart = timeToMinutes(a.startTime);
      const bStart = timeToMinutes(b.startTime);
      return aStart - bStart;
    });

    const overlapGroups: CollaborativeClassType[][] = [];
    let currentGroup: CollaborativeClassType[] = [];

    sortedClasses.forEach((cls, index) => {
      if (currentGroup.length === 0) {
        currentGroup.push(cls);
      } else {
        const hasOverlap = currentGroup.some((groupClass) =>
          classesOverlap(groupClass, cls)
        );

        if (hasOverlap) {
          currentGroup.push(cls);
        } else {
          overlapGroups.push([...currentGroup]);
          currentGroup = [cls];
        }
      }

      if (index === sortedClasses.length - 1) {
        overlapGroups.push([...currentGroup]);
      }
    });

    overlapGroups.forEach((group) => {
      if (group.length === 1) {
        processedClasses.push({
          ...group[0],
          totalColumns: 1,
          column: 0,
        });
      } else {
        const columnsAssigned = assignColumnsToOverlappingClasses(group);
        processedClasses.push(...columnsAssigned);
      }
    });
  });

  return processedClasses;
}

// Helper function to convert time string to minutes since start of day
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper function to check if two classes overlap in time
function classesOverlap(class1: UserClassType, class2: UserClassType): boolean {
  const start1 = timeToMinutes(class1.startTime);
  const end1 = timeToMinutes(class1.endTime);
  const start2 = timeToMinutes(class2.startTime);
  const end2 = timeToMinutes(class2.endTime);

  // Classes overlap if one starts before the other ends
  return start1 < end2 && start2 < end1;
}

// Helper function to assign columns to overlapping classes
function assignColumnsToOverlappingClasses(
  classes: CollaborativeClassType[]
): CollaborativeClassType[] {
  // Sort by start time, then by end time
  const sortedClasses = classes.sort((a, b) => {
    const aStart = timeToMinutes(a.startTime);
    const bStart = timeToMinutes(b.startTime);
    if (aStart !== bStart) return aStart - bStart;

    const aEnd = timeToMinutes(a.endTime);
    const bEnd = timeToMinutes(b.endTime);
    return aEnd - bEnd;
  });

  const columns: { endTime: number; classes: CollaborativeClassType[] }[] = [];
  const result: CollaborativeClassType[] = [];

  sortedClasses.forEach((cls) => {
    const startTime = timeToMinutes(cls.startTime);
    const endTime = timeToMinutes(cls.endTime);

    let assignedColumn = -1;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].endTime <= startTime) {
        assignedColumn = i;
        break;
      }
    }

    if (assignedColumn === -1) {
      assignedColumn = columns.length;
      columns.push({ endTime: 0, classes: [] });
    }

    columns[assignedColumn].endTime = endTime;
    columns[assignedColumn].classes.push(cls);

    result.push({
      ...cls,
      totalColumns: Math.max(columns.length, classes.length),
      column: assignedColumn,
    });
  });

  const totalColumns = columns.length;
  return result.map((cls) => ({
    ...cls,
    totalColumns,
  }));
}

// Alternative classes finder for collaborative timetable
export function findCollaborativeAlternativeClasses(
  allModuleClasses: UserClassType[],
  currentUserClasses: CollaborativeClassType[],
  selectedClass: UserClassType
): UserClassType[] {
  return allModuleClasses.filter((cls) => {
    if (cls.classId === selectedClass.classId) return false;

    const hasClass = currentUserClasses.some(
      (userClass) =>
        userClass.moduleId === cls.moduleId &&
        userClass.lessonType === cls.lessonType &&
        userClass.classId === cls.classId
    );

    return !hasClass;
  });
}
