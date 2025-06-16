import clsx from "clsx";
import { NavLink } from "react-router-dom";

type ModItemProps = {
  moduleCode: string;
  moduleName: string;
  homeOffice: string;
  courseUnits: number;
};

const ModItem = ({
  moduleCode,
  moduleName,
  homeOffice,
  courseUnits,
}: ModItemProps) => {
  return (
    <li>
      <NavLink
        to={`/modules/${moduleCode}`}
        className={({ isActive }) => {
          console.log(`NavLink for ${moduleCode}: isActive = ${isActive}`);
          return clsx("my-1 p-1 rounded-md text-blue-600 block", {
            "bg-blue-100": isActive,
            "hover:bg-gray-100": !isActive,
          });
        }}
      >
        <div className="mb-1">
          <span className="mr-2">
            <b>{moduleCode}</b>
          </span>
          <span>{moduleName}</span>
        </div>
        <div className="text-gray-500">
          <span className="mr-1">{homeOffice}</span>•
          <span className="ml-1">{`${courseUnits} Units`}</span>
        </div>
      </NavLink>
    </li>
  );
};

export default ModItem;
