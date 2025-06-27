import PostCard from "../components/PostCard";
import type { User, Post } from "../types";
import { useOutletContext } from "react-router-dom";

interface PostListProps {
  filteredPosts: Post[];
  handleLike: (postId: string) => void;
  setSelectedPostId: (postId: string) => void;
  currentUser: User;
  handleEditPost?: (postId: string) => void;
  handleDeletePost?: (postId: string) => void;
}

export default function PostList({ posts = [] }: { posts?: Post[] }) {
  const {
    filteredPosts,
    currentUser,
    handleLike,
    setSelectedPostId,
    handleEditPost,
    handleDeletePost,
  } = useOutletContext<PostListProps>();

  if (!posts || posts.length === 0) posts = filteredPosts;

  if (posts.length === 0) {
    return <div className="text-gray-500">No posts found.</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={{ ...post, replies: post.replies }}
          onLike={handleLike}
          onPostClick={setSelectedPostId}
          showActions={post.author.userId === currentUser.userId}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />
      ))}
    </div>
  );
}
