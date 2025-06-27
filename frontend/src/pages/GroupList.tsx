import { Link, useOutletContext } from "react-router-dom";
import type { User, Group } from "../types";

interface GroupListProps {
  groups: Group[];
  currentUser: User;
  handleEditGroup?: (groupId: string) => void;
  handleDeleteGroup?: (groupId: string) => void;
}

export default function GroupList({ groupList = [] }: { groupList?: Group[] }) {
  const { groups, currentUser, handleEditGroup, handleDeleteGroup } =
    useOutletContext<GroupListProps>();

  if (!groupList || groupList.length === 0) groupList = groups;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mt-4 h-min">
      {groupList.map((group) => (
        <Link
          key={group.groupId}
          className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          to={`/forum/group/${group.groupId}`}
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
          {group.author.userId === currentUser.userId && (
            <div className="px-6 pb-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditGroup?.(group.groupId);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup?.(group.groupId);
                }}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
