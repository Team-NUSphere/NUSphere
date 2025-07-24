import { useState } from "react"
import ModList from "./ModList"
import RegisteredModules from "./RegisteredModules"

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="relative flex h-full">
      {/* Sidebar Container */}
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          expanded ? "w-80" : "w-0"
        } shrink-0 bg-white border-r border-gray-200 shadow-sm overflow-hidden`}
        style={{ minWidth: expanded ? "20rem" : "0rem" }}
      >
        {/* Sidebar Content */}
        <div className="h-full flex flex-col">

          {/* Module Search Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-hidden">{expanded && <ModList />}</div>
          </div>

          {/* Registered Modules Section */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-gray-200">
            <div className="px-4 py-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">My Modules</h3>
            </div>
            <div className="flex-1 overflow-hidden">{expanded && <RegisteredModules />}</div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group"
        onClick={() => setExpanded((e) => !e)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <div
          className={`w-4 h-4 flex items-center justify-center text-gray-600 group-hover:text-gray-800 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </div>
  )
}
