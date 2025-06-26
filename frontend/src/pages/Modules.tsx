import { useParams } from "react-router-dom";
import { backend } from "../constants";
import axios from "axios";
import { useEffect, useState } from "react";
import ModInfo from "../components/ModInfo";
import Timetable from "./Timetable";
import type {
  UserClassType,
  UserModulesType,
} from "../contexts/timetableContext";

interface ModuleDetails {
  moduleId: string;
  title?: string;
  description?: string;
  faculty?: string;
  department?: string;
  gradingBasis?: string;
  moduleCredit?: number;
  Classes?: UserClassType[];
}

export default function Modules() {
  const { moduleCode } = useParams();
  let modInfo: ModuleDetails = { moduleId: moduleCode || "" };
  const [moduleData, setModuleData] = useState(modInfo);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    axios({
      method: "GET",
      url: `${backend}/modules/${moduleCode}`,
      signal: signal,
    })
      .then((res) => {
        modInfo = res.data;
        setModuleData(modInfo);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        }
        console.error(e);
      });

    return () => {
      controller.abort();
    };
  }, [moduleCode]);

  return (
    <div className="w-full h-full overflow-y-auto">
      <ModInfo module={moduleData} />
      <Timetable
        startHour={8}
        numOfHours={11}
        classes={moduleData.Classes || []}
      ></Timetable>
    </div>
  );
}
