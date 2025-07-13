"use client";

import { formatDistanceToNow } from "date-fns";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import type { User, Post } from "../types";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { likePost, unlikePost } from "../functions/forumApi";
import { useState } from "react";

interface PostCardProps {
  postProp: Post;
  onLike: (postId: string) => void;
  handleDeletePost: (postId: string) => void;
}

export default function PostCard({
  postProp,
  onLike,
  handleDeletePost,
}: PostCardProps) {
  const navigate = useNavigate();
  const { currentUser, handleEditPost } = useOutletContext<{
    currentUser: User;
    handleEditPost?: (post: Post) => void;
  }>();

  if (!postProp) return null;
  const [post, setPost] = useState<Post>({ ...postProp });

  const handleLikeClick = () => {
    if (post.isLiked) {
      setPost((prev) => ({
        ...prev,
        likes: prev.likes > 0 ? prev.likes - 1 : 0,
        isLiked: false,
      }));
      unlikePost(post.postId);
    } else {
      setPost((prev) => ({
        ...prev,
        likes: prev.likes + 1,
        isLiked: true,
      }));
      likePost(post.postId);
    }
  };

  return (
    <Link
      to={`/forum/post/${post.postId}`}
      state={{ post: post }}
      draggable={false}
      className="no-underline"
    >
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full transition-colors hover:bg-blue-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/forum/group/${post.groupId}`);
                }}
              >
                {post.groupName}
              </button>
              <span className="text-sm text-gray-500">
                {post.uid} •{" "}
                {formatDistanceToNow(post.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {post.title}
          </h3>

          <p className="text-gray-700 mb-4 line-clamp-3">{post.details}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLikeClick();
              }}
              className={`flex items-center gap-2 px-2 py-1 text-sm rounded-md hover:bg-gray-50 ${
                post.isLiked ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <FaRegThumbsUp
                className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`}
              />
              {post.likes}
            </button>

            <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500">
              <FaRegComment className="w-4 h-4" />
              {post.replies}
            </div>

            <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500">
              <IoEyeOutline className="w-4 h-4" />
              {post.views}
            </div>
          </div>
          {post.uid === currentUser.userId && (
            <div className="mt-2 flex gap-3 text-xs">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleEditPost?.(post);
                }}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeletePost(post.postId);
                }}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
