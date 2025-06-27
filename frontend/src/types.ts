export interface User {
  userId: string;
  username: string;
}

export interface Reply {
  replyId: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export interface Post {
  postId: string;
  title: string;
  details: string;
  timestamp: Date;
  groupName: string;
  groupId: string;
  likes: number;
  author: User;
  replies: Reply[];
  views: number;
  isLiked: boolean;
}

export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  postCount: number;
  createdAt: Date;
  isOwner: boolean;
  posts: Post[];
}
