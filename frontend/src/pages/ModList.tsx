import { FiSearch } from "react-icons/fi";
import ModItem from "../components/ModItem";
import React, { useEffect, useRef, useState } from "react";
import useModuleSearch from "../functions/useModuleSearch";
import useDebounce from "../functions/useDebounce";
import { getTimetableContext } from "../contexts/timetableContext";

export default function ModList() {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const debounceSearch = useDebounce<string>(search, 500);
  const { userModules } = getTimetableContext();

  const { moduleList, hasMore, loading, error } = useModuleSearch(
    debounceSearch,
    pageNumber
  );
  const filteredList = moduleList.filter(
    (mod) => !(mod.moduleId in userModules)
  );

  useEffect(() => {
    setPageNumber(1);
  }, [debounceSearch]);

  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observerTarget = observerRef.current;
    if (!observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(observerTarget);
    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
      observer.disconnect();
    };
  }, [hasMore, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="w-full overflow-y-auto">
      <form className="border-b-gray-500 border-b-1 flex flex-row items-center transition-colors">
        <FiSearch className="mr-2" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Course Codes/Names"
        ></input>
      </form>

      <ul>
        {filteredList.map((mod) => {
          return <ModItem key={mod.moduleId} module={mod} registered={false} />;
        })}
      </ul>
      {hasMore && (
        <div ref={observerRef}>
          {loading ? <p>Loading more modules...</p> : <p>scroll to load</p>}
        </div>
      )}
      <div>{error && "...Error loading modules..."}</div>
    </div>
  );
}
