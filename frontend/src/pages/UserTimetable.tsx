import { getTimetableContext } from "../contexts/timetableContext";
import Timetable from "./Timetable";

export default function UserTimetable() {
  const { userClasses } = getTimetableContext();

  return (
    <div className="w-full h-full relative">
      <Timetable
        startHour={8}
        numOfHours={14}
        classes={userClasses}
      ></Timetable>
      {/* <div className="absolute flex justify-end bottom-0.5 right-0.5">
        <AddEventModal />
      </div> */}
    </div>
  );
}
