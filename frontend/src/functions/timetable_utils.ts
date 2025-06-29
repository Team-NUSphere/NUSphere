import type { UserClassType, UserModulesType } from "../contexts/timetableContext";
import { differenceInMinutes, parse } from "date-fns";

// Helper function to detect overlapping classes
export default function detectOverlaps(classes: UserClassType[], startHour: number) {
  const baseDate = new Date()
  const baseTime = parse(`${startHour.toString().padStart(2, "0")}:00:00`, "HH:mm:ss", baseDate)

  const classesWithTimes = classes
    .map((lesson) => {
      const startTime = parse(lesson.startTime, "HH:mm:ss", baseDate)
      const endTime = parse(lesson.endTime, "HH:mm:ss", baseDate)
      const startMinutes = differenceInMinutes(startTime, baseTime)
      const endMinutes = differenceInMinutes(endTime, baseTime)

      return {
        ...lesson,
        startMinutes,
        endMinutes,
        column: 0, 
        totalColumns: 1, 
      }
    })
    .sort((a, b) => a.startMinutes - b.startMinutes)


  const processedClasses = []

  for (let i = 0; i < classesWithTimes.length; i++) {
    const currentClass = classesWithTimes[i]
    const overlappingClasses = [currentClass]

    for (let j = i + 1; j < classesWithTimes.length; j++) {
      const otherClass = classesWithTimes[j]

      if (otherClass.startMinutes < currentClass.endMinutes) {
        overlappingClasses.push(otherClass)
      } else {
        break 
      }
    }

    overlappingClasses.forEach((cls, index) => {
      cls.column = index
      cls.totalColumns = overlappingClasses.length
    })

    processedClasses.push(...overlappingClasses)
    i += overlappingClasses.length - 1
  }

  return processedClasses
}

export const findAlternativeClasses = (
    allFilteredClasses: UserClassType[],
    currentUserClasses: UserClassType[],
    selectedClass: UserClassType,
): UserClassType[] => {

    return allFilteredClasses.filter(
        (cls) =>
            cls.classId !== selectedClass.classId &&
            !currentUserClasses.some((userCls) => userCls.classId === cls.classId),
    );
};