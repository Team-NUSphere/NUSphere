import { useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../constants";

type modInfo = {
  moduleId: string;
  title: string;
  faculty: string;
  moduleCredit: number;
};

export default function useModuleSearch(query: string, pageNumber: number) {
  const [moduleList, setModuleList] = useState<modInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    setModuleList([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const controller = new AbortController();
    const signal = controller.signal;

    axios({
      method: "GET",
      url: `${backend}/modules/modList`,
      params: {
        q: query,
        page: pageNumber,
      },
      signal: signal,
    })
      .then((res) => {
        setModuleList((prevList) => {
          return [...new Set([...prevList, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log("Request cancelled: " + e.message);
        }
        console.error(e);
        setError(true);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [query, pageNumber]);

  return { moduleList, loading, error, hasMore };
}
