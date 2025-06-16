import { useParams } from "react-router-dom";
import { backend } from "../constants";
import axios from "axios";
import { useState } from "react";

export default function Modules() {
  const { moduleCode } = useParams();
  let modInfo: object = { moduleCode: moduleCode };
  const [displayData, setDisplayData] = useState(JSON.stringify(modInfo));
  axios({
    method: "GET",
    url: `${backend}/modules/${moduleCode}`,
  })
    .then((res) => {
      modInfo = res.data;
      setDisplayData(JSON.stringify(modInfo));
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        console.log("Request cancelled: " + e.message);
      }
      console.error(e);
    });

  return (
    <div>
      <h1>{`mod details: ${moduleCode}`}</h1>
      <p>{displayData}</p>
    </div>
  );
}
