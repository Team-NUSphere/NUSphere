import { useParams } from "react-router-dom";
import { backend } from "../constants";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Modules() {
  const { moduleCode } = useParams();
  let modInfo: object = { moduleCode: moduleCode };
  const [displayData, setDisplayData] = useState(JSON.stringify(modInfo));
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
        setDisplayData(JSON.stringify(modInfo));
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
    <div>
      <h1>{`mod details: ${moduleCode}`}</h1>
      <p>{displayData}</p>
    </div>
  );
}
