import type React from "react"
import type { UserClassType } from "../contexts/timetableContext"

const MODULE_COLORS = [
  "#CC5500", // orange
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#84cc16", // lime
]

// Function to get consistent color for a module
const getModuleColor = (moduleId: string): string => {
  let hash = 5381;
  for (let i = 0; i < moduleId.length; i++) {
    hash = (hash * 33) ^ moduleId.charCodeAt(i); 
  }
  hash = Math.abs(hash);
  return MODULE_COLORS[hash % MODULE_COLORS.length];
};


export default function DayClass({
  event,
  style,
  onClick,
  isSelected = false,
  isAlternative = false,
  onAlternativeClick,
  selectedClass,
}: {
  event: UserClassType
  style?: React.CSSProperties
  onClick?: () => void
  isSelected?: boolean
  isAlternative?: boolean
  onAlternativeClick?: () => void
  selectedClass?: UserClassType
}) {
  const handleClick = () => {
    console.log("Clicked on class:", event.classId, event.moduleId)
    console.log("isSelected:", isSelected)
    console.log("isAlternative:", isAlternative)
    if (isAlternative && onAlternativeClick) {
      onAlternativeClick()
    } else if (onClick) {
      onClick()
    }
  }

  const moduleColor = getModuleColor(event.moduleId)


  const alternativeColor = selectedClass ? getModuleColor(selectedClass.moduleId) : moduleColor

  // Helper function to create lighter shade for alternatives
  const lightenColor = (color: string, amount = 0.3) => {
  
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)

    const newR = Math.round(r + (255 - r) * amount)
    const newG = Math.round(g + (255 - g) * amount)
    const newB = Math.round(b + (255 - b) * amount)

    return `rgb(${newR}, ${newG}, ${newB})`
  }

  return (
    <div
      className={`absolute rounded-md px-2 py-1 text-xs shadow-sm border-2 transition-all duration-400 ease-out select-none ${
        isAlternative
          ? "opacity-70 hover:opacity-90 z-50 cursor-pointer border-dashed"
          : isSelected
            ? "z-40 ring-2 ring-orange-400 ring-offset-1"
            : "hover:opacity-90 z-30 cursor-pointer"
      }`}
      style={{
        ...style,
        backgroundColor: isAlternative ? lightenColor(alternativeColor, 0.7) : moduleColor + "90",
        borderColor: isAlternative ? alternativeColor : isSelected ? "#fb923c" : moduleColor,
        margin: "2px",
        width: style?.width ? `calc(${style.width} - 4px)` : undefined,
        minWidth: "70px",
      }}
      onClick={handleClick}
    >
      <div className="font-semibold truncate">{event.moduleId}</div>
      <div className="text-gray-700 truncate">{`${event.lessonType} [${event.classNo}]`}</div>
      <div className="text-gray-600 truncate text-xs">{event.venue}</div>
    </div>
  )
}
