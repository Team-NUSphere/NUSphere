import ModItem from "../components/ModItem";
import { getWebSocketContext } from "../contexts/webSocketContext";
import UserTimetable from "./UserTimetable";

export default function Room() {
  const { syncedData } = getWebSocketContext();
  return (
    <div className="grow-1 h-full grid grid-rows-[3fr_1fr] gap-1 shrink-0">
      <div className="overflow-y-auto">
        <UserTimetable />
      </div>
      <div className="w-full overflow-x-auto">
        <ul className="flex h-full">
          {syncedData
            ? Object.entries(syncedData).map(([userId, userData]) => (
                <li
                  key={userId}
                  className="flex flex-col w-1/4 p-2 border-r last:border-r-0"
                >
                  <h3 className="font-bold">{userId}</h3>
                  <ul>
                    {Object.entries(userData.modules ?? {}).map(
                      ([moduleCode, modInfo]) => (
                        <ModItem
                          key={moduleCode}
                          module={modInfo}
                          registered={true}
                        />
                      )
                    )}
                  </ul>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
