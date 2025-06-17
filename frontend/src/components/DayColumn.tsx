import clsx from "clsx";
import DayEvent from "./DayEvent";

export default function DayColumn({
  dayName,
  numOfHours,
}: {
  dayName: string;
  numOfHours: number;
}) {
  return (
    <li className="flex flex-col flex-grow-1 flex-shrink-0 basis-auto">
      {/* Day header */}
      <div className="h-10 p-2 text-center sticky top-0 bg-white/70 rounded-lg">
        {dayName}
      </div>
      {/* Event grid */}
      <div
        className={clsx(
          "flex-grow basis-auto bg-[image:linear-gradient(to_bottom,#eff6ff_0%,#eff6ff_50%,white_50%,white_100%)]",
          {
            "rounded-bl-lg": dayName === "MON",
            "rounded-br-lg": dayName === "FRI",
          }
        )}
        style={{
          backgroundSize: `20% ${200 / numOfHours}%`,
        }}
      >
        <DayEvent></DayEvent>
      </div>
    </li>
  );
}
