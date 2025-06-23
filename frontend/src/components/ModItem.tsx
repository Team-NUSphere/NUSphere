import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import {
  getTimetableContext,
  type modInfo,
} from "../contexts/timetableContext";

export type ModItemProps = {
  module: modInfo;
  registered: boolean;
};

const ModItem = ({ module, registered }: ModItemProps) => {
  const { registerModule, removeModule } = getTimetableContext();
  return (
    <li>
      <NavLink
        to={`/modules/${module.moduleId}`}
        className={({ isActive }) =>
          clsx(
            "flex flex-col my-1 p-1 rounded-md text-blue-600 transition-colors duration-200 ease-out",
            {
              "bg-blue-100": isActive,
              "hover:bg-gray-100": !isActive,
            }
          )
        }
      >
        <div className="">
          <span className="mr-2">
            <b>{module.moduleId}</b>
          </span>
          <span>{module.title}</span>
        </div>
        <span className="text-gray-500">{module.faculty}</span>
        <div className="flex relative">
          <span className="text-gray-500">{`${module.moduleCredit} Units`}</span>
          <div className="absolute right-0 text-xl">
            {!registered ? (
              <button>
                <FiPlusCircle
                  onClick={(e) => {
                    registerModule(module);
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  removeModule(module.moduleId);
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <FiXCircle />
              </button>
            )}
          </div>
        </div>
      </NavLink>
    </li>
  );
};

export default ModItem;
