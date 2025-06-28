import { useOutletContext } from "react-router-dom";
import type { Group, Post } from "../types";
import GroupList from "./GroupList";
import PostList from "../components/PostList";

export default function MyPostsGroups() {
  const { myPosts, myGroups } = useOutletContext<{
    myPosts: Post[];
    myGroups: Group[];
  }>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">My Posts</h3>
        <PostList posts={myPosts} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">My Groups</h3>
        <GroupList groupList={myGroups} />
      </div>
    </div>
  );
}
