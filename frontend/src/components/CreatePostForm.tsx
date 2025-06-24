import React, { useState, useEffect, useRef } from "react";
import { FaAngleDown } from "react-icons/fa";

interface CreatePostFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  postTitle: string;
  setPostTitle: (title: string) => void;
  postContent: string;
  setPostContent: (content: string) => void;
  groups: string[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
}

export default function CreatePostForm({
  onCancel,
  onSubmit,
  postTitle,
  setPostTitle,
  postContent,
  setPostContent,
  groups,
  selectedGroup,
  setSelectedGroup,
}: CreatePostFormProps) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredGroups = groups.filter((group) =>
    group.toLowerCase().includes(search.toLowerCase())
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [showDropdown]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Create a New Post</h2>

      {/*Group selection with search functionality*/}
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Select a group"
          onFocus={() => setShowDropdown(!showDropdown)}
          onChange={(e) => setSearch(e.target.value)}
          value={selectedGroup || search}
          className="w-full border border-gray-300 rounded-md px-4 py-2"
        />
        <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {showDropdown && (
          <div className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-md max-h-60 overflow-y-auto shadow-lg w-full">
            {filteredGroups.map((group) => (
              <div
                key={group}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedGroup(group);
                  setSearch("");
                  setShowDropdown(false);
                }}
              >
                {group}
              </div>
            ))}
            {filteredGroups.length === 0 && (
              <div className="px-4 py-2 text-gray-500">No matches found</div>
            )}
          </div>
        )}
      </div>

      {/* Post title and content inputs */}
      <input
        type="text"
        placeholder="Post title"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      <textarea
        placeholder="Write your post details here..."
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        rows={6}
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
