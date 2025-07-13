import { useState } from "react";
import ModList from "./ModList";
import RegisteredModules from "./RegisteredModules";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`relative transition-all duration-300 ${
        expanded ? "w-72" : "w-0"
      } shrink-0 grid grid-rows-[3fr_1fr] divide-y-5 gap-1 divide-double bg-white border-r border-gray-200 mt-2`}
      style={{ minWidth: expanded ? "18rem" : "0rem" }}
    >
      <button
        className="absolute top-1/2 right-[-16px] -translate-y-1/2 z-10 bg-gray-100 rounded-full p-1 shadow hover:bg-gray-200 transition"
        onClick={() => setExpanded((e) => !e)}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        style={{ border: "1px solid #e5e7eb" }}
      >
        <span className="text-lg">{expanded ? "⏴" : "⏵"}</span>
      </button>

      <div className="overflow-auto">
        {expanded && <ModList />}
      </div>

      <div className="overflow-auto">
        {expanded && <RegisteredModules />}
      </div>
    </div>
  );
}
