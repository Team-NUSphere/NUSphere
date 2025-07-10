import PostCard from "./PostCard";
import type { User, Post } from "../types";
import { useOutletContext } from "react-router-dom";

interface PostListContext {
  filteredPosts: Post[];
  handleLike: (postId: string) => void;
  setSelectedPostId: (postId: string) => void;
  currentUser: User;
}

interface PostListProps {
  posts: Post[];
  handleDeletePost?: (postId: string) => void;
}

export default function PostList({
  posts = [],
  handleDeletePost = () => {},
}: PostListProps) {
  const { handleLike } = useOutletContext<PostListContext>();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          postProp={post}
          onLike={handleLike}
          handleDeletePost={handleDeletePost}
        />
      ))}
    </div>
  );
}
