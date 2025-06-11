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
      <div>
        <div>
          <Link to={`/mod/${moduleCode}`}>
            <span>{moduleCode}</span>
            <span>{moduleName}</span>
          </Link>
        </div>
        <div>
          <span>{homeOffice}</span>•<span>{`${courseUnits} Units`}</span>
        </div>
      </div>
    </li>
  );
};

export default ModItem;
