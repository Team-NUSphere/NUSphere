import Timetable from "./Timetable";

export default function UserTimetable() {
  return (
    <div className="w-full">
      <Timetable
        type="/userTimetable"
        id="/"
        startHour={8}
        numOfHours={11}
      ></Timetable>
    </div>
  );
}
