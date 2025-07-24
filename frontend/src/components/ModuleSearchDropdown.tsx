import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import useModuleSearch from "../functions/useModuleSearch";
import useDebounce from "../functions/useDebounce";
import { type modInfo } from "../contexts/timetableContext";

export default function ModuleSearchDropdown({
  onSelect,
  selected,
}: {
  onSelect: (module: modInfo) => void;
  selected: modInfo | null;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const debounceSearch = useDebounce<string>(search, 300);
  const { moduleList, hasMore, loading, error } = useModuleSearch(
    debounceSearch,
    pageNumber
  );

  const showDropdown = isFocused || search.length > 0;

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (mod: modInfo) => {
    onSelect(mod);
    setSearch("");
  };

  // Reset on new search
  useEffect(() => {
    setPageNumber(1);
  }, [debounceSearch]);

  // Infinite scroll
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
      { root: dropdownRef.current, threshold: 0.1 }
    );

    observer.observe(observerTarget);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="relative w-full max-w-md">
      <div
        className={`flex items-center gap-2 rounded-md px-3 py-2 shadow-sm border transition-colors ${
          isFocused ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-300"
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() =>
          setTimeout(() => {
            setIsFocused(false);
            setSearch("");
          }, 100)
        }
      >
        <FiSearch className="text-gray-400" />
        <input
          value={
            isFocused
              ? search
              : selected
              ? selected.moduleId + " — " + selected.title
              : ""
          }
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search module to swap"
          className="w-full outline-none"
        />
      </div>

      {showDropdown && search && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
        >
          {moduleList.length === 0 && !loading && (
            <div className="p-2 text-sm text-gray-500">
              No matching modules found
            </div>
          )}

          <ul className="divide-y divide-gray-100">
            {moduleList.map((mod) => (
              <li
                key={mod.moduleId}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSelect(mod)}
              >
                <span className="font-medium">{mod.moduleId}</span> —{" "}
                <span className="text-gray-600">{mod.title}</span>
              </li>
            ))}
            {hasMore && (
              <div ref={observerRef} className="px-4 py-2 text-sm text-center">
                {loading ? "Loading..." : "Scroll to load more"}
              </div>
            )}
          </ul>

          {error && (
            <div className="p-2 text-sm text-red-500">
              Error loading modules
            </div>
          )}
        </div>
      )}
    </div>
  );
}
