"use client";

import { useState, useEffect, useRef } from "react";
import { FaAngleDown, FaUsers, FaEdit } from "react-icons/fa";
import { createGroup } from "../functions/forumApi";

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
  const [createType, setCreateType] = useState<"post" | "group">("post");

  // Group creation states
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

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

  const handleCreatePost = () => {
    // TODO: Implement post creation logic
    console.log("Creating post:", {
      title: postTitle,
      content: postContent,
      group: selectedGroup,
    });
    onSubmit();
  };

  const handleCreateGroup = async () => {
    await createGroup(groupName, groupDescription);
    onCancel();
    onSubmit();
  };

  const handleSubmit = () => {
    if (createType === "post") {
      handleCreatePost();
    } else {
      handleCreateGroup();
    }
  };

  const isFormValid = () => {
    if (createType === "post") {
      return postTitle.trim() && postContent.trim() && selectedGroup;
    } else {
      return groupName.trim() && groupDescription.trim();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header with type selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Create New</h2>

        {/* Type Selection Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCreateType("post")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-all ${
              createType === "post"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaEdit className="w-4 h-4" />
            Create Post
          </button>
          <button
            onClick={() => setCreateType("group")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-all ${
              createType === "group"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaUsers className="w-4 h-4" />
            Create Group
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-4">
        {createType === "post" ? (
          // Post Creation Form
          <>
            {/* Group selection with search functionality */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Group <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Choose a group for your post"
                  onFocus={() => setShowDropdown(!showDropdown)}
                  onChange={(e) => setSearch(e.target.value)}
                  value={selectedGroup || search}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {showDropdown && (
                  <div className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg w-full">
                    {filteredGroups.map((group) => (
                      <div
                        key={group}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => {
                          setSelectedGroup(group);
                          setSearch("");
                          setShowDropdown(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <FaUsers className="w-4 h-4 text-gray-400" />
                          {group}
                        </div>
                      </div>
                    ))}
                    {filteredGroups.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No groups found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Post title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive title for your post"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Post content */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Post Content <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
              />
            </div>
          </>
        ) : (
          // Group Creation Form
          <>
            {/* Group name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter a unique name for your group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Group description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Group Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe what this group is about, its purpose, and what kind of discussions members can expect..."
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
              />
            </div>

            {/* Group creation info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaUsers className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Creating a new group</p>
                  <p>
                    You'll become the group administrator and can manage posts,
                    members, and group settings.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            isFormValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {createType === "post" ? "Create Post" : "Create Group"}
        </button>
      </div>
    </div>
  );
}
