import { useEffect, useState } from "react";
import type { modInfo } from "../contexts/timetableContext";
import ModuleSearchDropdown from "./ModuleSearchDropdown";
import { getAllLessonClasses } from "../functions/classSwapApi";

type lessonClassTypes = {
  [type: string]: string[];
};

export default function NewSwap({
  onCreate,
}: {
  onCreate: (data: {
    moduleCode: string;
    lessonType: string;
    fromClassNo: string;
    toClassNos: string[];
  }) => void;
}) {
  const [selectedModule, setSelectedModule] = useState<modInfo | null>(null);

  const [lessonTypes, setLessonTypes] = useState<lessonClassTypes>({});

  const [activeTab, setActiveTab] = useState<string>("");

  const [fromClassSelections, setFromClassSelections] = useState<{
    [lessonType: string]: string | null;
  }>({});

  const [toClassSelections, setToClassSelections] = useState<{
    [lessonType: string]: Set<string>;
  }>({});

  useEffect(() => {
    const getLessonTypes = async () => {
      if (selectedModule) {
        const response = await getAllLessonClasses(selectedModule.moduleId);
        setLessonTypes(response);
        setActiveTab(Object.keys(response)[0] || "");
      }
    };
    getLessonTypes();
  }, [selectedModule]);

  const handleSelectModule = (module: modInfo) => {
    setSelectedModule(module);
    const types = Object.keys(lessonTypes);
    setActiveTab(types[0] || "");
  };

  const toggleFromClass = (lessonType: string, cls: string) => {
    setFromClassSelections((prev) => ({
      ...prev,
      [lessonType]: prev[lessonType] === cls ? null : cls,
    }));
  };

  const toggleToClass = (lessonType: string, cls: string) => {
    setToClassSelections((prev) => {
      const currentSet = new Set(prev[lessonType] || []);
      if (currentSet.has(cls)) {
        currentSet.delete(cls);
      } else {
        currentSet.add(cls);
      }
      return { ...prev, [lessonType]: currentSet };
    });
  };

  const isFormValid = () => {
    return (
      selectedModule &&
      activeTab &&
      fromClassSelections[activeTab] &&
      toClassSelections[activeTab]?.size > 0 &&
      !toClassSelections[activeTab].has(fromClassSelections[activeTab])
    );
  };

  const handleCreateSwapRequest = async () => {
    if (!isFormValid() || !selectedModule) return;
    const fromClassNo = fromClassSelections[activeTab]!;
    const toClassNos = Array.from(toClassSelections[activeTab] || []);
    // Call API to create new swap request
    onCreate({
      moduleCode: selectedModule.moduleId,
      lessonType: activeTab,
      fromClassNo,
      toClassNos,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-3xl max-h-[85vh] flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 shrink-0">
        New Swap Request
      </h2>

      <ModuleSearchDropdown
        onSelect={handleSelectModule}
        selected={selectedModule}
      />

      {selectedModule && Object.keys(lessonTypes).length > 0 && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex space-x-4 mt-6 border-b border-gray-200 shrink-0">
            {Object.keys(lessonTypes).map((type) => (
              <button
                key={type}
                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === type
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 mt-6 overflow-y-auto">
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
              {/* Left: FROM (Radio-style) */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
                  Your Class
                </h3>
                <div className="flex flex-wrap gap-2 justify-around">
                  {lessonTypes[activeTab]?.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleFromClass(activeTab, cls)}
                      className={`px-4 py-1 rounded-full text-sm border ${
                        fromClassSelections[activeTab] === cls
                          ? "bg-blue-100 border-blue-500 text-blue-700 hover:bg-blue-200"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle: Arrow Icon */}
              <div className="flex items-center justify-center pt-6 text-gray-500">
                <span className="text-2xl">↔</span>
              </div>

              {/* Right: TO (Multi-select) */}
              <div className="mr-3">
                <h3 className="text-sm font-medium text-gray-600 mb-2 text-center">
                  Preferred Swaps
                </h3>
                <div className="flex flex-wrap gap-2 justify-around">
                  {lessonTypes[activeTab]?.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => toggleToClass(activeTab, cls)}
                      className={`px-4 py-1 rounded-full text-sm border ${
                        toClassSelections[activeTab]?.has(cls)
                          ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-200"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleCreateSwapRequest}
            disabled={!isFormValid()}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors mt-4 ${
              isFormValid()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Request
          </button>
        </div>
      )}
    </div>
  );
}
