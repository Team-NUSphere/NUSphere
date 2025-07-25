import { FiSearch } from "react-icons/fi"
import ModItem from "../components/ModItem"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import useModuleSearch from "../functions/useModuleSearch"
import useDebounce from "../functions/useDebounce"
import { getTimetableContext } from "../contexts/timetableContext"

export default function ModList() {
  const [search, setSearch] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const debounceSearch = useDebounce<string>(search, 500)
  const { userModules } = getTimetableContext()

  const { moduleList, hasMore, loading, error } = useModuleSearch(debounceSearch, pageNumber)
  const filteredList = moduleList.filter((mod) => !(mod.moduleId in userModules))

  useEffect(() => {
    setPageNumber(1)
  }, [debounceSearch])

  const observerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const observerTarget = observerRef.current
    if (!observerTarget) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading && hasMore) {
          setPageNumber((prev) => prev + 1)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    )
    observer.observe(observerTarget)
    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget)
      }
      observer.disconnect()
    }
  }, [hasMore, loading])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Course Codes/Names"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto">

        {!error && filteredList.length === 0 && !loading && search && (
          <div className="p-4 text-center text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-sm">No modules found for "{search}"</p>
          </div>
        )}

        <ul className="p-2">
          {filteredList.map((mod) => (
            <ModItem key={mod.moduleId} module={mod} registered={false} />
          ))}
        </ul>

        {/* Loading Indicator */}
        {hasMore && (
          <div ref={observerRef} className="p-4 text-center">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm">Loading more modules...</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">scroll to load</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
