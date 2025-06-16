import { FiSearch } from "react-icons/fi";
import ModItem from "../components/ModItem";
import React, { useEffect, useRef, useState } from "react";
import useModuleSearch from "../functions/useModuleSearch";
import useDebounce from "../functions/useDebounce";

export default function Sidebar() {
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const debounceSearch = useDebounce<string>(search, 500);

  const { moduleList, hasMore, loading, error } = useModuleSearch(
    debounceSearch,
    pageNumber
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
    <div className="sidebar w-75 p-2 overflow-y-auto shrink-0">
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
        {moduleList.map((module) => {
          return (
            <ModItem
              moduleCode={module.moduleId}
              moduleName={module.title}
              homeOffice={module.faculty}
              courseUnits={module.moduleCredit}
              key={module.moduleId}
            />
          );
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
