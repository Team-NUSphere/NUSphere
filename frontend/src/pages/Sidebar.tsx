import ModList from "./ModList";
import RegisteredModules from "./RegisteredModules";

export default function Sidebar() {
  return (
    <div className="w-75 p-2 shrink-0 grid grid-rows-[3fr_1fr] divide-y-5 gap-1 divide-double">
      <ModList></ModList>
      <RegisteredModules />
    </div>
  );
}
