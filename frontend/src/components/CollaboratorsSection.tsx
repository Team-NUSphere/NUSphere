import type React from "react";

import { useState } from "react";
import type { CollaboratorData } from "../pages/CollaborateTimetable";

interface ModuleInfo {
  moduleId: string;
  title: string;
  faculty: string;
  moduleCredit: number;
}

interface CollaboratorsSectionProps {
  collaborators: CollaboratorData[];
  selectedCollaborators: string[];
  onToggleCollaborator: (userId: string) => void;
}

function ModuleTooltip({
  modules,
  children,
}: {
  modules: ModuleInfo[];
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);

  if (modules.length === 0) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-[9999]">
          <div className="bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 min-w-80 max-w-2xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="font-semibold text-sm text-gray-100">
                Modules ({modules.length})
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {modules.map((module) => (
                  <div
                    key={module.moduleId}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-600 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-blue-300 text-sm">
                        {module.moduleId}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                        {module.moduleCredit} MC
                      </span>
                    </div>
                    <div className="text-gray-200 text-sm leading-relaxed mb-2">
                      {module.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {module.faculty}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollaboratorsSection({
  collaborators,
  selectedCollaborators,
  onToggleCollaborator,
}: CollaboratorsSectionProps) {
  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center gap-2 mb-2">
        {/* Simple users icon using SVG */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 className="font-semibold text-lg">Collaborators</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Toggle visibility of each person's schedule
      </p>

      <div className="flex flex-wrap gap-6">
        {collaborators.map((collaborator) => (
          <div key={collaborator.userId} className="flex items-center gap-3">
            {/* Native checkbox styled with Tailwind */}
            <input
              type="checkbox"
              checked={selectedCollaborators.includes(collaborator.userId)}
              onChange={() => onToggleCollaborator(collaborator.userId)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />

            {/* Simple avatar using div */}
            <div
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium text-white"
              style={{
                backgroundColor: collaborator.color,
                borderColor: collaborator.color,
              }}
            >
              {collaborator.username.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">
                {collaborator.userId === "You" ? "You" : collaborator.username}
              </span>
              <ModuleTooltip modules={collaborator.modules}>
                <span className="text-sm text-gray-600 cursor-help hover:text-blue-600 hover:underline transition-colors font-medium">
                  {collaborator.moduleCount} mods
                </span>
              </ModuleTooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
