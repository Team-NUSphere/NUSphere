import axios from "axios";
import { backend } from "../constants";

export async function fetchPosts(signal: AbortSignal) {
  const res = await axios.get(`${backend}/posts`, { signal });

  return res.data.map((post: any) => ({
    postId: post.postId,
    title: post.title,
    details: post.details,
    timestamp: new Date(post.createdAt),
    groupName: post.ForumGroup?.name || "",
    likes: post.likes,
    author: {
      userId: post.User?.uid || "",
      username: post.User?.username || "Unknown",
    },
    replies: (post.Replies || []).map((reply: any) => ({
      replyId: reply.commentId,
      author: {
        userId: reply.User?.uid || "",
        username: reply.User?.username || "Unknown",
      },
      content: reply.content,
      timestamp: new Date(reply.createdAt),
      likes: reply.likes,
      isLiked: false,
    })),
    isLiked: false,
    views: post.views || 0,
  }));
}
