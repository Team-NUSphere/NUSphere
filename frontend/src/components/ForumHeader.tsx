import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";

interface ForumHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
}

export default function ForumHeader({
  searchQuery,
  onSearchChange,
  onCreateClick,
}: ForumHeaderProps) {
  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
          Forum
        </h1>

        <div className="relative flex-1 max-w-md">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          <FaPlus className="w-4 h-4" />
          Create
        </button>
      </div>
    </div>
  );
}
