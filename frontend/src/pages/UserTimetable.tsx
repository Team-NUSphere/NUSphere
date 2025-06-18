import RegisteredModules from "./RegisteredModules";
import Timetable from "./Timetable";

export default function UserTimetable() {
  return (
    <div className="w-full">
      <Timetable startHour={8} numOfHours={11}></Timetable>
      <RegisteredModules />
    </div>
  );
}
