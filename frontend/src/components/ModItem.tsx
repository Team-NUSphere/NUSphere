import clsx from "clsx"
import { NavLink } from "react-router-dom"
import { FiPlusCircle, FiXCircle } from "react-icons/fi"
import { getTimetableContext, type modInfo } from "../contexts/timetableContext"

export type ModItemProps = {
  module: modInfo
  registered: boolean
}

const ModItem = ({ module, registered }: ModItemProps) => {
  const { registerModule, removeModule } = getTimetableContext()

  return (
    <li className="mb-2">
      <NavLink
        to={`/modules/${module.moduleId}`}
        className={({ isActive }) =>
          clsx("group block p-3 rounded-lg border transition-all duration-200 ease-out", {
            "bg-blue-50 border-blue-200 shadow-sm": isActive,
            "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm": !isActive,
          })
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Module Code and Title */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-blue-600 text-sm">
                <b>{module.moduleId}</b>
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {module.moduleCredit} Units
              </span>
            </div>

            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-relaxed">{module.title}</h4>

            {/* Faculty */}
            {module.faculty && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                </div>
                <span className="truncate">{module.faculty}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {!registered ? (
              <button
                onClick={(e) => {
                  registerModule(module)
                  e.stopPropagation()
                  e.preventDefault()
                }}
                className="p-1.5 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 group-hover:scale-110"
                aria-label="Add module"
              >
                <FiPlusCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  removeModule(module.moduleId)
                  e.stopPropagation()
                  e.preventDefault()
                }}
                className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group-hover:scale-110"
                aria-label="Remove module"
              >
                <FiXCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </NavLink>
    </li>
  )
}

export default ModItem
