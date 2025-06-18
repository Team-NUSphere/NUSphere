import ModItem from "../components/ModItem";
import {
  getTimetableContext,
  type modInfo,
} from "../contexts/timetableContext";

export default function RegisteredModules() {
  const { userModules } = getTimetableContext();
  const allModules: modInfo[] = Object.values(userModules);
  return (
    <div>
      {allModules.map((event) => (
        <ModItem
          key={event.moduleId}
          moduleCode={event.moduleId}
          moduleName={event.title}
          homeOffice={event.faculty}
          courseUnits={event.moduleCredit}
        />
      ))}
    </div>
  );
}
