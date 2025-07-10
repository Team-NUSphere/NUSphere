"use client";

import { useEffect, useState } from "react";
import {
  getGroupTagList,
  getPostTagList,
  updatePost,
} from "../functions/forumApi";
import type { Post } from "../types";
import PostTagInput from "./PostTagInput";

interface CreatePostFormProps {
  onCancel: () => void;
  post: Post | null;
}

export default function EditPostForm({ onCancel, post }: CreatePostFormProps) {
  if (!post) return null;
  const [postTitle, setPostTitle] = useState(post?.title || "");
  const [postContent, setPostContent] = useState(post?.details || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags || []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const groupTags = await getGroupTagList(post.groupId);
        setAvailableTags(groupTags);
      } catch (error) {
        console.error("Failed to fetch group tags:", error);
      }
    };

    if (availableTags.length === 0) fetchTags();
  }, [post.postId, post.groupId, availableTags]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getPostTagList(post.postId);
        setSelectedTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    if (selectedTags.length === 0) {
      fetchTags();
    }
  }, [post.postId, post.groupId]);

  const isFormValid = () => {
    return postTitle.trim() && postContent.trim();
  };

  const handleEditPost = async () => {
    await updatePost(post.postId, {
      title: postTitle,
      details: postContent,
      tags: selectedTags,
    });
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header with type selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
      </div>

      {/* Form Content */}
      <div className="space-y-4">
        {/* Group selection with search functionality */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Selected Group
          </label>
          <div className="relative">
            <input
              type="text"
              value={post?.groupName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Post title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter a descriptive title for your post"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Post content */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Post Content <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Share your thoughts, ask questions, or start a discussion..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
          />
        </div>

        {/* Post tags */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Post Tags <span className="text-red-500">*</span>
          </label>
          <PostTagInput
            availableTags={availableTags}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEditPost}
            disabled={!isFormValid()}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              isFormValid()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
  );
}
