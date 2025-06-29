import React from "react";

interface ModuleDetails {
  moduleId?: string;
  title?: string;
  description?: string;
  faculty?: string;
  department?: string;
  gradingBasis?: string;
  moduleCredit?: number;
}

const ModInfo: React.FC<{ module: ModuleDetails }> = ({ module }) => {
  return (
    <div className="w-full mx-auto p-6 bg-white  space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-blue-600 ">
          {module.title} ({module.moduleId})
        </h2>
        <p className="text-gray-600 ">{module.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 ">
        <div>
          <span className="font-semibold">Faculty:</span> {module.faculty}
        </div>
        <div>
          <span className="font-semibold">Department:</span> {module.department}
        </div>
        <div>
          <span className="font-semibold">Grading:</span> {module.gradingBasis}
        </div>
        <div>
          <span className="font-semibold">Credits:</span> {module.moduleCredit}
        </div>
      </div>
    </div>
  );
};

export default ModInfo;
