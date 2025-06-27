import type { Group } from "../types";

interface GroupListProps {
  groups: Group[];
  onClick: (groupId: string) => void;
}

export default function GroupList({ groups, onClick }: GroupListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {groups.map((group) => (
        <div
          key={group.groupId}
          className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onClick(group.groupId)}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.groupName}</h3>
            <p className="text-gray-600 text-sm">{group.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">{group.postCount} posts</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
