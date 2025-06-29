import ModItem from "../components/ModItem";
import {
  getTimetableContext,
  type modInfo,
} from "../contexts/timetableContext";

export default function RegisteredModules() {
  const { userModules } = getTimetableContext();
  const allModules: modInfo[] = Object.values(userModules);
  return (
    <div className="w-full overflow-y-auto">
      {allModules.map((event) => (
        <ModItem key={event.moduleId} module={event} registered={true} />
      ))}
    </div>
  );
}
