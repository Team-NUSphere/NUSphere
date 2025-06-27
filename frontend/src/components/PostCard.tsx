"use client";

import type React from "react";

import { formatDistanceToNow } from "date-fns";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import type { User, Post } from "../types";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onPostClick: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showActions?: boolean;
}

export default function PostCard({
  post,
  onLike,
  onPostClick,
  onEdit,
  onDelete,
  showActions,
}: PostCardProps) {
  const handlePostClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on interactive elements
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onPostClick(post.postId);
  };

  return (
    <Link to={`/forum/post/${post.postId}`} className="no-underline">
      <div
        onClick={handlePostClick}
        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full transition-colors hover:bg-blue-200"
                to={`/forum/group/${post.groupId}`}
              >
                {post.groupName}
              </Link>
              <span className="text-sm text-gray-500">
                {post.author.username} •{" "}
                {formatDistanceToNow(post.timestamp, {
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
                e.stopPropagation();
                onLike(post.postId);
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
              {post.replies.length}
            </div>

            <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-500">
              <IoEyeOutline className="w-4 h-4" />
              {post.views}
            </div>
          </div>
          {showActions && (
            <div className="mt-2 flex gap-3 text-xs">
              <button
                onClick={() => onEdit?.(post.postId)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(post.postId)}
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
