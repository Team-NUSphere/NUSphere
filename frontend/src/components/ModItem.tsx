import { Link } from "react-router-dom";

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
      <div className="my-3">
        <div className="mb-1">
          <Link to={`/mod/${moduleCode}`} className="text-blue-600">
            <span className="mr-3">{moduleCode}</span>
            <span>{moduleName}</span>
          </Link>
        </div>
        <div className="text-gray-500">
          <span className="mr-2">{homeOffice}</span>•
          <span className="ml-2">{`${courseUnits} Units`}</span>
        </div>
      </div>
    </li>
  );
};

export default ModItem;
