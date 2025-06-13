import { FiSearch } from "react-icons/fi";
import ModItem from "./ModItem";

export default function Sidebar() {
  return (
    <div className="sidebar w-75 p-2">
      <form className="border-b-gray-500 border-b-1 flex flex-row items-center transition-colors">
        <FiSearch className="mr-2" />
        <input placeholder="Course Codes/Names"></input>
      </form>

      <ul>
        <ModItem
          moduleCode="CS1101S"
          moduleName="Programming Methodology I"
          homeOffice="Dean's Office (Computing)"
          courseUnits={4}
        />
        <ModItem
          moduleCode="CS1101S"
          moduleName="Programming Methodology I"
          homeOffice="Dean's Office (Computing)"
          courseUnits={4}
        />
      </ul>
    </div>
  );
}
