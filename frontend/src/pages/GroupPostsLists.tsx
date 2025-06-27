import { Link, useOutletContext, useParams } from "react-router-dom";
import PostList from "./PostList";
import type { Group } from "../types";

export default function GroupPostsLists() {
  const { groups, myGroups } = useOutletContext<{
    groups: Group[];
    myGroups: Group[];
  }>();
  const { groupId } = useParams();
  if (!groupId) return null;
  const group = [...groups, ...myGroups].find((g) => g.groupId === groupId);

  return (
    <div>
      <Link
        to="/forum/group"
        draggable={false}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Groups
      </Link>
      <h3 className="text-lg font-semibold mb-4">
        {group?.groupName || "Group"} Posts
      </h3>
      <PostList posts={group?.posts || []} />
    </div>
  );
}
