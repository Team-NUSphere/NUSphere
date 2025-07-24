import { useEffect, useState } from "react";
import ResourceCluster from "../components/ResourceCluster";
import { Link, useParams } from "react-router-dom";
import type { Group, ResourceClusterType } from "../types";
import {
  createGroupResourceCluster,
  deleteGroupResourceCluster,
  getGroupResourceList,
} from "../functions/forumApi";
import { getAuth } from "../contexts/authContext";
import { v4 as uuidv4 } from "uuid";
import { FaArrowLeft } from "react-icons/fa6";

export default function ForumResourcePage() {
  const { groupId } = useParams();
  const { currentUser } = getAuth();

  if (!groupId) {
    return (
      <div className="w-full p-6 mx-auto">
        <p className="text-red-600">Group ID is missing in the URL.</p>
      </div>
    );
  }
  const [group, setGroup] = useState<{
    groupId: string;
    groupName: string;
    ownerId: string;
  } | null>(null);
  const [clusters, setClusters] = useState<ResourceClusterType[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await getGroupResourceList(groupId);
        if (response) {
          setGroup({
            groupId: response.groupId,
            groupName: response.groupName,
            ownerId: response.ownerId,
          });
          setClusters(response.ResourceClusters || []);
          setIsOwner(response.ownerId === currentUser?.uid);
        }
      } catch (error) {
        console.error("Failed to fetch group resources:", error);
      }
    };

    fetchGroup();
  }, [groupId]);

  const [creatingCluster, setCreatingCluster] = useState(false);
  const handleCreateCluster = async () => {
    if (!group) return;
    setCreatingCluster((prev) => !prev);
  };
  const handleNewCluster = (name: string, description: string) => {
    if (!group) return;
    const tempId = uuidv4();
    setClusters((prev) => [
      {
        clusterId: tempId,
        name: name,
        description: description,
        Resources: [],
        groupId: group.groupId,
      },
      ...prev,
    ]);
    createGroupResourceCluster(group.groupId, name, description)
      .then((clusterId) => {
        if (typeof clusterId.data !== "string") {
          console.error("Invalid cluster ID returned:", clusterId.data);
          return;
        }
        setClusters((prev) =>
          prev.map((c) =>
            c.clusterId === tempId ? { ...c, clusterId: clusterId.data } : c
          )
        );
      })
      .catch((error) => {
        console.error("Failed to create cluster:", error);
      });
    setCreatingCluster(false);
  };

  const handleDeleteCluster = async (clusterId: string) => {
    setClusters((prev) => prev.filter((c) => c.clusterId !== clusterId));
    try {
      await deleteGroupResourceCluster(groupId, clusterId);
    } catch (error) {
      console.error("Failed to delete cluster:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-2 mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            draggable={false}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold">
            {group?.groupName} Resource Page
          </h1>
        </div>
        {isOwner && (
          <button
            onClick={handleCreateCluster}
            className="px-4 py-2 p-6 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Cluster
          </button>
        )}
      </div>

      {clusters.length === 0 && (
        <p className="italic text-gray-500">No resource clusters yet.</p>
      )}

      {creatingCluster && (
        <ResourceCluster
          create={true}
          isOwner={isOwner}
          cluster={{
            clusterId: "",
            name: "",
            description: "",
            Resources: [],
            groupId: group?.groupId || "",
          }}
          onCancel={() => setCreatingCluster(false)}
          onCreate={handleNewCluster}
        />
      )}

      {clusters.map((cluster) => (
        <ResourceCluster
          key={cluster.clusterId}
          cluster={cluster}
          isOwner={isOwner}
          onDelete={handleDeleteCluster}
        />
      ))}
    </div>
  );
}
