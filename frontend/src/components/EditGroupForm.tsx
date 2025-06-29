"use client";

import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { createGroup, updateGroup } from "../functions/forumApi";
import type { Group } from "../types";

interface EditGroupFormProps {
  onCancel: () => void;
  group: Group | null;
}

export default function EditGroupForm({ onCancel, group }: EditGroupFormProps) {
  if (!group) return;
  const [groupName, setGroupName] = useState(group.groupName || "");
  const [groupDescription, setGroupDescription] = useState(
    group.description || ""
  );

  const handleEditGroup = async () => {
    await updateGroup(group.groupId, {
      groupName: groupName,
      description: groupDescription,
    });
    onCancel();
  };

  const isFormValid = () => {
    return groupName.trim() && groupDescription.trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header with type selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Edit Group</h2>
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

      {/* Group creation info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FaUsers className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Editing an existing group</p>
            <p>
              This group will have its name updated to{" "}
              <strong>{groupName}</strong> and its description updated to{" "}
              <strong>{groupDescription}</strong>
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
          onClick={handleEditGroup}
          disabled={!isFormValid()}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            isFormValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Edit Group
        </button>
      </div>
    </div>
  );
}
