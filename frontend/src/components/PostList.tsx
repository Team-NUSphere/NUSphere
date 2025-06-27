import PostCard from "./PostCard";
import type { User, Post } from "../types";

interface PostListProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onPostClick: (postId: string) => void;
  currentUser: User;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostList({ posts, onLike, onPostClick, currentUser, onEdit, onDelete }: PostListProps) {
  if (posts.length === 0) {
    return <div className="text-gray-500">No posts found.</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={{ ...post, replies: post.replies }}
          onLike={onLike}
          onPostClick={onPostClick}
          showActions={post.author.userId === currentUser.userId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
