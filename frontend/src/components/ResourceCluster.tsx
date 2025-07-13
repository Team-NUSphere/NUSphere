import { useState } from "react";
import ResourceItem from "./ResourceItem";
import type { ResourceClusterType } from "../types";
import {
  createGroupResource,
  deleteClusterResource,
  editGroupResourceCluster,
} from "../functions/forumApi";
import { v4 as uuidv4 } from "uuid";

export default function ResourceCluster({
  cluster,
  isOwner,
  create = false,
  onCancel,
  onCreate,
  onDelete,
}: {
  cluster: ResourceClusterType;
  isOwner: boolean;
  create?: boolean;
  onCreate?: (name: string, description: string) => void;
  onDelete?: (clusterId: string) => void;
  onCancel?: () => void;
}) {
  const [editing, setEditing] = useState(create);
  const [clusterName, setClusterName] = useState(cluster.name);
  const [clusterDescription, setClusterDescription] = useState(
    cluster.description
  );
  const [resources, setResources] = useState(cluster.Resources || []);
  const [addResource, setAddResource] = useState<boolean>(false);

  const handleSave = async () => {
    if (!isFormValid()) {
      alert("Please fill in the required fields.");
      return;
    }
    if (create && onCreate) {
      onCreate(clusterName, clusterDescription);
      return;
    }
    setEditing(false);
    cluster.name = clusterName;
    cluster.description = clusterDescription;
    editGroupResourceCluster(
      cluster.groupId,
      cluster.clusterId,
      clusterName,
      clusterDescription
    );
  };

  const isFormValid = () => {
    return clusterName.trim();
  };

  const handleCancel = () => {
    if (create && onCancel) {
      onCancel();
    }
    setClusterName(cluster.name);
    setClusterDescription(cluster.description);
    setEditing(false);
  };

  const handleDeleteCluster = () => {
    if (onDelete) {
      onDelete(cluster.clusterId);
    }
  };

  const handleCreateResource = (
    title: string,
    link: string,
    description: string
  ) => {
    const tempId = uuidv4();
    setResources((prev) => [
      {
        resourceId: tempId,
        name: title,
        link: link,
        description: description,
      },
      ...prev,
    ]);
    createGroupResource(cluster.clusterId, title, link, description)
      .then((response) => {
        const resourceId = response.data;
        if (typeof resourceId !== "string") {
          console.error("Invalid resource ID returned:", resourceId);
          return;
        }
        setResources((prev) =>
          prev.map((r) =>
            r.resourceId === tempId ? { ...r, resourceId: resourceId } : r
          )
        );
      })
      .catch((error) => {
        console.error("Failed to create resource:", error);
      });
    setAddResource(false);
  };

  const handleDeleteResource = async (resourceId: string) => {
    setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));
    try {
      await deleteClusterResource(cluster.clusterId, resourceId);
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  return (
    <div className="w-full border border-gray-300 rounded-xl p-5 shadow-sm bg-white space-y-5 transition hover:shadow-md">
      {/* Cluster Header */}
      <div className="flex justify-between items-start">
        {!editing ? (
          <div>
            <h2 className="text-xl font-semibold">{clusterName}</h2>
            <p className="text-sm text-gray-600 mt-1">{clusterDescription}</p>
          </div>
        ) : (
          <div className="flex flex-col w-full space-y-3">
            <input
              type="text"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Cluster name"
            />
            <textarea
              value={clusterDescription}
              onChange={(e) => setClusterDescription(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Cluster description"
              rows={3}
            />
            <div className="flex gap-2 pt-1">
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

        {/* Action Buttons */}
        {isOwner && !editing && (
          <div className="flex gap-2 text-sm text-right">
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteCluster}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Resource List */}
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceItem
            key={resource.resourceId}
            resource={resource}
            isOwner={isOwner}
            clusterId={cluster.clusterId}
            onDelete={handleDeleteResource}
          />
        ))}

        {addResource && (
          <ResourceItem
            create={true}
            resource={{
              resourceId: "",
              name: "",
              link: "",
              description: "",
            }}
            clusterId={cluster.clusterId}
            isOwner={isOwner}
            onCancel={() => setAddResource(false)}
            onCreate={handleCreateResource}
          />
        )}

        {isOwner && !create && !addResource && (
          <button
            onClick={() => setAddResource(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Resource
          </button>
        )}
      </div>
    </div>
  );
}
