import { Link, useOutletContext } from "react-router-dom";
import type { User, Group } from "../types";
import { useEffect, useRef, useState } from "react";
import { deleteGroup, fetchAllGroups } from "../functions/forumApi";
import useDebounce from "../functions/useDebounce";

interface GroupListProps {
  groups: Group[];
  currentUser: User;
  handleEditGroup?: (group: Group) => void;
  searchQuery: string;
  setSelectedGroup: (group: { groupId: string; groupName: string }) => void;
}

export default function GroupList({
  groups = [],
  handleDeleteMyGroup,
}: {
  groups?: Group[];
  handleDeleteMyGroup?: (groupId: string) => void;
}) {
  const { currentUser, handleEditGroup, searchQuery, setSelectedGroup } =
    useOutletContext<GroupListProps>();

  if (groups && handleDeleteMyGroup) {
    return (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4 h-min">
        {groups.map((group) => (
          <Link
            key={group.groupId}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            to={`/forum/group/${group.groupId}`}
            onClick={() => {
              setSelectedGroup({
                groupId: group.groupId,
                groupName: group.groupName,
              });
            }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {group.groupName}
              </h3>
              <p className="text-gray-600 text-sm">{group.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {group.postCount} posts
                </span>
              </div>
            </div>
            <div className="px-6 pb-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditGroup?.(group);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteMyGroup(group.groupId);
                }}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  const [pageNumber, setPageNumber] = useState(1);
  const debouncedQuery = useDebounce<string>(searchQuery, 500);
  const { groupList, loading, error, hasMore, deleteGroupFromList } =
    fetchAllGroups(debouncedQuery, pageNumber);

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedQuery]);

  const observerRef = useRef<HTMLDivElement | null>(null);
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
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(observerTarget);
    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
      observer.disconnect();
    };
  }, [hasMore, loading]);

  const handleDeleteGroup = (groupId: string) => {
    deleteGroupFromList(groupId);
    deleteGroup(groupId).catch((err) => {
      console.error("Failed to delete group:", err);
    });
  };

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4 h-min">
      {groupList.map((group) => (
        <Link
          key={group.groupId}
          className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          to={`/forum/group/${group.groupId}`}
          onClick={() => {
            setSelectedGroup({
              groupId: group.groupId,
              groupName: group.groupName,
            });
          }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {group.groupName}
            </h3>
            <p className="text-gray-600 text-sm">{group.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {group.postCount} posts
              </span>
            </div>
          </div>
          {group.ownerId === currentUser.userId && (
            <div className="px-6 pb-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditGroup?.(group);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteGroup(group.groupId);
                }}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </Link>
      ))}
      {hasMore && (
        <div ref={observerRef} className="col-span-2 text-center mt-4 h-12">
          {loading ? <p>Loading more groups...</p> : <p>Scroll to load more</p>}
        </div>
      )}
      <div>{error && "...Error loading groups..."}</div>
    </div>
  );
}
