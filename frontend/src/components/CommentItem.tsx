import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import type { User, Reply } from "../types";

interface CommentItemProps {
  comment: Reply;
  currentUser: User;
  onLike: (commentId: string, like: boolean) => void;
  onReply: (parentCommentId: string, replyText: string) => void;
  expandCommentComments: (commentId: string) => void;
  depth: number;
}

export default function CommentItem({
  comment,
  currentUser,
  onLike,
  onReply,
  expandCommentComments,
  depth,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentExpanded, setCommentExpanded] = useState(false);

  const maxDepth = 4; // Maximum nesting depth
  const indentWidth = Math.min(depth * 24, maxDepth * 24); // Limit indentation

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    await onReply(comment.commentId, replyText);
    setReplyText("");
    setShowReplyForm(false);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4" style={{ marginLeft: `${indentWidth}px` }}>
        {/* Comment Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {comment.uid.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{comment.uid}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(comment.commentId, !comment.isLiked)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors ${
              comment.isLiked ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <FaRegThumbsUp
              className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`}
            />
            <span className="text-xs font-medium">{comment.likes}</span>
          </button>
          <button
            onClick={() => {
              if (!commentExpanded && comment.replies > 0) {
                expandCommentComments(comment.commentId);
                setCommentExpanded(true);
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <FaRegComment className="w-3 h-3" />
            <span className="text-xs font-medium">{comment.replies}</span>
          </button>
          {depth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Reply
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">
                  {currentUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim() || isSubmitting}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSend className="w-3 h-3" />
                    {isSubmitting ? "Posting..." : "Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.Replies && comment.Replies.length > 0 && (
        <div className="space-y-2">
          {comment.Replies.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              currentUser={currentUser}
              onLike={onLike}
              onReply={onReply}
              expandCommentComments={expandCommentComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
