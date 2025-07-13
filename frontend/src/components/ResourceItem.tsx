import { useState } from "react";
import type { Resource } from "../types";
import { editClusterResource } from "../functions/forumApi";

export default function ResourceItem({
  resource,
  isOwner,
  create = false,
  clusterId,
  onCancel,
  onCreate,
  onDelete,
}: {
  resource: Resource;
  isOwner: boolean;
  create?: boolean;
  clusterId: string;
  onCancel?: () => void;
  onCreate?: (title: string, link: string, description: string) => void;
  onDelete?: (resourceId: string) => void;
}) {
  const [resourceLink, setResourceLink] = useState(resource.link);
  const [resourceName, setResourceName] = useState(resource.name);
  const [resourceDescription, setResourceDescription] = useState(
    resource.description
  );
  const [editing, setEditing] = useState(create);

  const handleSave = () => {
    if (!isFormValid()) {
      alert("Please fill in the required fields.");
      return;
    }
    if (create && onCreate) {
      onCreate(resourceName, resourceLink, resourceDescription);
      return;
    }
    setEditing(false);
    resource.name = resourceName;
    resource.link = resourceLink;
    resource.description = resourceDescription;
    editClusterResource(
      clusterId,
      resource.resourceId,
      resourceName,
      resourceLink,
      resourceDescription
    );
  };

  const isFormValid = () => {
    return resourceName.trim();
  };

  const handleCancel = () => {
    if (create && onCancel) {
      onCancel();
    }
    setResourceLink(resource.link);
    setResourceName(resource.name);
    setResourceDescription(resource.description);
    setEditing(false);
  };

  const handleDeleteResource = () => {
    if (onDelete) {
      onDelete(resource.resourceId);
    }
  };

  return (
    <div className="flex justify-between items-start border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="w-full mr-4">
        {!editing ? (
          <div>
            <a
              href={resourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline text-lg"
            >
              {resourceName}
            </a>
            <p className="text-sm text-gray-600 mt-1">{resourceDescription}</p>
          </div>
        ) : (
          <div className="flex flex-col w-full space-y-3">
            <input
              type="text"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Resource name"
            />
            <input
              type="text"
              value={resourceLink}
              onChange={(e) => setResourceLink(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Resource link"
            />
            <textarea
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Resource description"
              rows={3}
            />
            <div className="flex gap-2 pt-1 justify-end">
              <button
                onClick={handleSave}
                className="text-sm bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {isOwner && !editing && (
        <div className="flex flex-col gap-1 text-right text-sm">
          <button
            onClick={() => setEditing(true)}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteResource}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
