import clsx from "clsx"
import DayClass from "./DayClass"
import { differenceInMinutes, parse } from "date-fns"
import type { UserClassType } from "../contexts/timetableContext"
import detectOverlaps from "../functions/timetable_utils"

export default function DayColumn({
  dayName,
  numOfHours,
  startHour,
  selectedClass,
  onClassClick,
  onAlternativeClassClick,
  allClassesToShow,
}: {
  dayName: string
  numOfHours: number
  startHour: number
  selectedClass?: UserClassType
  allClassesToShow: UserClassType[]
  onClassClick?: (userClass: UserClassType) => void
  onAlternativeClassClick?: (alternativeClass: UserClassType) => void
}) {
  const numOfMinutes: number = numOfHours * 60
  const baseDate = new Date()
  const baseTime = parse(`${startHour.toString().padStart(2, "0")}:00:00`, "HH:mm:ss", baseDate)

  const processedClasses = detectOverlaps(allClassesToShow, startHour)

  const maxOverlaps = Math.max(1, ...processedClasses.map((cls) => cls.totalColumns))
  const minColumnWidth = Math.max(150, maxOverlaps * 80)

  return (
    <div className="flex flex-col flex-grow" style={{ minWidth: `${minColumnWidth}px` }}>
      {/* Day header */}
      <div className="h-10 p-2 text-center sticky top-0 bg-white/70 rounded-lg z-50">{dayName}</div>
      {/* Event grid */}
      <div
        className={clsx("flex-grow basis-auto bg-gradient-to-b from-blue-50 via-blue-50 to-white", {
          "rounded-bl-lg": dayName === "MON",
          "rounded-br-lg": dayName === "FRI",
        })}
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${
            100 / numOfHours - 0.1
          }%, #e5e7eb ${100 / numOfHours}%)`,
        }}
      >
        <div className="relative h-full">
          {processedClasses.map((lesson) => {
            const startTime = parse(lesson.startTime, "HH:mm:ss", baseDate)
            const endTime = parse(lesson.endTime, "HH:mm:ss", baseDate)
            const topPercentage = (differenceInMinutes(startTime, baseTime) * 100) / numOfMinutes
            const heightPercentage = (differenceInMinutes(endTime, startTime) * 100) / numOfMinutes
            const zIndex = Math.floor(topPercentage)

            const widthPercentage = 100 / lesson.totalColumns
            const leftPercentage = (lesson.column * 100) / lesson.totalColumns

            const isUserClass = lesson.chosen || false
            const isAlternative = !isUserClass
            const isSelected = selectedClass === lesson

            return (
              <DayClass
                key={lesson.classId}
                event={lesson}
                selectedClass={selectedClass}
                style={{
                  top: `${topPercentage}%`,
                  height: `${heightPercentage}%`,
                  left: `${leftPercentage}%`,
                  width: `${widthPercentage}%`,
                  zIndex: zIndex,
                }}
                onClick={() => {
                  if (isUserClass && onClassClick) {
                    onClassClick(lesson)
                  }
                }}
                onAlternativeClick={() => {
                  if (isAlternative && onAlternativeClassClick) {
                    onAlternativeClassClick(lesson)
                  }
                }}
                isSelected={isSelected}
                isAlternative={isAlternative}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
