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
  replies: ReplyRecord;
}

export interface ReplyRecord {
  [replyId: string]: Reply;
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
  replies: ReplyRecord;
  views: number;
  isLiked: boolean;
}

export interface PostRecord {
  [postId: string]: Post;
}

export interface Group {
  groupId: string;
  groupName: string;
  description: string;
  postCount: number;
  createdAt: Date;
  ownerId: string;
  posts: Post[]; //not useful for now, it would be better to segregate what we can seperate
}
