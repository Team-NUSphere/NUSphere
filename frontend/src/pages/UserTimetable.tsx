import { getTimetableContext } from "../contexts/timetableContext";
import Timetable from "./Timetable";
import AddEventModal from "../components/AddEventModal";
import { mockAllModuleClasses } from "../constants";

export default function UserTimetable() {
  const { userClasses, userModules } = getTimetableContext();

  //Mock data for dev
  const allModuleClasses = mockAllModuleClasses

  const userModuleIds = Object.keys(userModules);
  const filteredAllModuleClasses = allModuleClasses.filter((cls) => userModuleIds.includes(cls.moduleId))

  return (
    <div className="w-full h-full relative">
      <Timetable
        startHour={8}
        numOfHours={14}
        classes={userClasses}
        allModuleClasses={filteredAllModuleClasses}
      ></Timetable>
      <div className="absolute flex justify-end bottom-0.5 right-0.5">
        <AddEventModal />
      </div>
    </div>
  );
}
