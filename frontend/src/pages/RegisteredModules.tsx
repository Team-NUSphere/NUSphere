import ModItem from "../components/ModItem"
import { getTimetableContext, type modInfo } from "../contexts/timetableContext"

export default function RegisteredModules() {
  const { userModules } = getTimetableContext()
  const allModules: modInfo[] = Object.values(userModules)

  return (
    <div className="h-full flex flex-col">
      {/* Stats Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {allModules.length} Module{allModules.length !== 1 ? "s" : ""} Registered
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {allModules.reduce((total, mod) => total + (mod.moduleCredit || 0), 0)} Units
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto">
        {allModules.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
            </div>
            <p className="text-sm">No modules registered yet</p>
            <p className="text-xs text-gray-400 mt-1">Search and add modules above</p>
          </div>
        ) : (
          <ul className="p-2">
            {allModules.map((module) => (
              <ModItem key={module.moduleId} module={module} registered={true} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
