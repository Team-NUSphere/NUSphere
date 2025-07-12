import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { createGroup } from "../functions/forumApi";
import GroupTagInput from "./GroupTagInput";

interface CreatePostFormProps {
  onCancel: () => void;
}

export default function CreatePostForm({ onCancel }: CreatePostFormProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const [tags, setTags] = useState<string[]>([]);

  const handleCreateGroup = async () => {
    await createGroup(groupName, groupDescription, tags);
    onCancel();
  };

  const isFormValid = () => {
    return groupName.trim() && groupDescription.trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header with type selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Create New</h2>
        <div
          className={
            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-all bg-white text-blue-600 shadow-sm"
          }
        >
          <FaUsers className="w-4 h-4" />
          Create Group
        </div>
      </div>

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

      {/* Group tags */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Group Tags <span className="text-red-500">*</span>
        </label>
        <GroupTagInput value={tags} onChange={setTags} />
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

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateGroup}
          disabled={!isFormValid()}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            isFormValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create Group
        </button>
      </div>
    </div>
  );
}
