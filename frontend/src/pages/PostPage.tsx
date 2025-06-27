import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaRegThumbsUp, FaRegComment, FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import CommentItem from "../components/CommentItem";
import { Link, useOutletContext, useParams } from "react-router-dom";

interface User {
  userId: string;
  username: string;
}

interface Post {
  postId: string;
  title: string;
  details: string;
  timestamp: Date;
  groupName: string;
  likes: number;
  author: User;
  views: number;
  isLiked: boolean;
}

interface Comment {
  commentId: string;
  comment: string;
  timestamp: Date;
  parentId: string;
  parentType: "ParentComment" | "ParentPost";
  uid: string;
  author: User;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface PostPageProps {
  currentUser: User;
}

export default function PostPage() {
  const postId = useParams();
  if (!postId) return null;

  const { currentUser } = useOutletContext<PostPageProps>();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual data from your backend
  const [post] = useState<Post>({
    postId: "1",
    title: "Need help with assignment 1",
    details:
      "I'm struggling with the first part of the assignment. Can someone explain the concept of recursion? I've been trying to understand it for hours but I'm still confused about how the function calls itself and when it stops. Any help would be appreciated!",
    author: { userId: "1", username: "StudentUser" },
    timestamp: new Date("2025-06-23T14:45:00Z"),
    groupName: "CS1101",
    likes: 20,
    views: 150,
    isLiked: false,
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      commentId: "1",
      comment:
        "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem. Think of it like Russian dolls - each doll contains a smaller version of itself.",
      timestamp: new Date("2025-06-23T15:30:00Z"),
      parentId: "1",
      parentType: "ParentPost",
      uid: "2",
      author: { userId: "2", username: "TutorUser" },
      likes: 15,
      isLiked: false,
      replies: [
        {
          commentId: "2",
          comment:
            "That's a great analogy! Can you provide a simple code example?",
          timestamp: new Date("2025-06-23T16:00:00Z"),
          parentId: "1",
          parentType: "ParentComment",
          uid: "3",
          author: { userId: "3", username: "CuriousStudent" },
          likes: 5,
          isLiked: false,
          replies: [
            {
              commentId: "3",
              comment:
                "Here's a simple factorial example: function factorial(n) { if (n <= 1) return 1; return n * factorial(n - 1); }",
              timestamp: new Date("2025-06-23T16:15:00Z"),
              parentId: "2",
              parentType: "ParentComment",
              uid: "2",
              author: { userId: "2", username: "TutorUser" },
              likes: 8,
              isLiked: false,
            },
          ],
        },
        {
          commentId: "4",
          comment: "This helped me understand it better too, thanks!",
          timestamp: new Date("2025-06-23T17:00:00Z"),
          parentId: "1",
          parentType: "ParentComment",
          uid: "4",
          author: { userId: "4", username: "AnotherStudent" },
          likes: 3,
          isLiked: false,
        },
      ],
    },
    {
      commentId: "5",
      comment:
        "I recommend watching some YouTube videos on recursion. Visual explanations really help!",
      timestamp: new Date("2025-06-23T18:00:00Z"),
      parentId: "1",
      parentType: "ParentPost",
      uid: "5",
      author: { userId: "5", username: "HelpfulPeer" },
      likes: 7,
      isLiked: false,
    },
  ]);

  const fetchPostData = async () => {
    // TODO: Fetch post data from backend
    console.log("Fetching post data for postId:", postId);
  };

  const fetchComments = async () => {
    // TODO: Fetch comments from backend
    console.log("Fetching comments for post:", postId);
  };

  // Handler functions with TODO comments
  const handleLikePost = () => {
    // TODO: Implement like post functionality
    console.log("Like post:", postId);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // TODO: Implement submit comment functionality
    console.log("Submit comment:", {
      comment: newComment,
      parentId: postId,
      parentType: "ParentPost",
      uid: currentUser.userId,
    });

    // Mock adding comment to state
    const mockComment: Comment = {
      commentId: Date.now().toString(),
      comment: newComment,
      timestamp: new Date(),
      parentId: postId,
      parentType: "ParentPost",
      uid: currentUser.userId,
      author: currentUser,
      likes: 0,
      isLiked: false,
    };

    setComments([...comments, mockComment]);
    setNewComment("");
    setIsSubmitting(false);
  };

  const handleLikeComment = (commentId: string) => {
    // TODO: Implement like comment functionality
    console.log("Like comment:", commentId);

    // Mock update comment likes
    const updateCommentLikes = (commentsList: Comment[]): Comment[] => {
      return commentsList.map((comment) => {
        if (comment.commentId === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentLikes(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(updateCommentLikes(comments));
  };

  const handleReplyToComment = (parentCommentId: string, replyText: string) => {
    // TODO: Implement reply to comment functionality
    console.log("Reply to comment:", { parentCommentId, replyText });

    // Mock adding reply
    const mockReply: Comment = {
      commentId: Date.now().toString(),
      comment: replyText,
      timestamp: new Date(),
      parentId: parentCommentId,
      parentType: "ParentComment",
      uid: currentUser.userId,
      author: currentUser,
      likes: 0,
      isLiked: false,
    };

    const addReplyToComment = (commentsList: Comment[]): Comment[] => {
      return commentsList.map((comment) => {
        if (comment.commentId === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), mockReply],
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments(addReplyToComment(comments));
  };

  useEffect(() => {
    fetchPostData();
    fetchComments();
  }, [postId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
          <Link
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            to="/forum/post"
          >
            <FaArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {post.groupName}
          </span>
        </div>

        {/* Scrollable Content: Post, Add Comment, Comments */}
        <div
          className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-6"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          {/* Post Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {post.author.username}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {post.title}
              </h1>
              <p className="text-gray-700 leading-relaxed">{post.details}</p>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleLikePost}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                  post.isLiked ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <FaRegThumbsUp
                  className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`}
                />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-500">
                <FaRegComment className="w-4 h-4" />
                <span className="text-sm">{comments.length} comments</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <IoEyeOutline className="w-4 h-4" />
                <span className="text-sm">{post.views} views</span>
              </div>
            </div>
          </div>

          {/* Add Comment */}
          <div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">
                  {currentUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share something..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSend className="w-4 h-4" />
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                currentUser={currentUser}
                onLike={handleLikeComment}
                onReply={handleReplyToComment}
                depth={0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
